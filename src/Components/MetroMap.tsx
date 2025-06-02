import type { RefObject } from "react";
import { Card, Space, Button, Typography, Tag, Divider } from "antd";
import type { Station, SubwayLine } from "./MetroMapContainer";

const { Text, Title } = Typography;

interface MetroMapProps {
  mapContainerRef: RefObject<HTMLDivElement | null>;
  selectedStation: Station | null;
  selectedLine: string | null;
  subwayLines: SubwayLine[];
  transferStations: Station[];
  zoomToStation: (station: Station) => void;
  highlightLine: (lineId: string) => void;
  resetView: () => void;
}

const MetroMap = ({
  mapContainerRef,
  selectedStation,
  selectedLine,
  subwayLines,
  transferStations,
  zoomToStation,
  highlightLine,
  resetView,
}: MetroMapProps) => {
  return (
    <div
      style={{ height: "100%", display: "flex", gap: "16px", width: "100%" }}
    >
      {/* 사이드 패널 */}
      <div
        style={{
          width: "350px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* 컨트롤 패널 - 고정 */}
        <Card title="🚇 노선도" size="small" style={{ flexShrink: 0 }}>
          <Space
            direction="vertical"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Button block onClick={resetView}>
              전체 보기
            </Button>
            <Text
              type="secondary"
              style={{ fontSize: "12px", textAlign: "center" }}
            >
              역이나 노선을 클릭하여 상세 정보를 확인하세요
            </Text>
          </Space>
        </Card>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingRight: "8px",
            minHeight: 0,
          }}
        >
          {/* 노선 목록 */}
          <Card title="🚉 지하철 노선" size="small" style={{ flexShrink: 0 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {subwayLines.map((line) => (
                <Button
                  key={line.id}
                  block
                  size="small"
                  type={selectedLine === line.id ? "primary" : "default"}
                  onClick={() => highlightLine(line.id)}
                  style={{
                    textAlign: "center",
                    height: "auto",
                    padding: "8px 12px",
                    borderColor: line.color,
                    backgroundColor:
                      selectedLine === line.id ? line.color : "white",
                    color: selectedLine === line.id ? "white" : line.color,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <strong>{line.name}</strong>
                    <br />
                    <small style={{ opacity: 0.8 }}>
                      {line.stations.length}개 역 운행
                    </small>
                  </div>
                </Button>
              ))}
            </Space>
          </Card>

          {/* 환승역 */}
          <Card title="🔄 주요 환승역" size="small" style={{ flexShrink: 0 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {transferStations.map((station) => (
                <Button
                  key={station.id}
                  block
                  size="small"
                  type={
                    selectedStation?.id === station.id ? "primary" : "default"
                  }
                  onClick={() => zoomToStation(station)}
                  style={{
                    textAlign: "center",
                    height: "auto",
                    padding: "8px 12px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <strong>{station.name}</strong>
                    <br />
                    <div style={{ marginTop: "4px", textAlign: "center" }}>
                      {station.lines.map((lineId) => {
                        const line = subwayLines.find((l) => l.id === lineId);
                        return line ? (
                          <Tag
                            key={lineId}
                            color={line.color}
                            style={{ margin: "1px", fontSize: "10px" }}
                          >
                            {line.name}
                          </Tag>
                        ) : null;
                      })}
                    </div>
                  </div>
                </Button>
              ))}
            </Space>
          </Card>

          {/* 선택된 역 정보 */}
          {selectedStation && (
            <Card title="ℹ️ 역 정보" size="small" style={{ flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <Title
                  level={4}
                  style={{ margin: "0 0 8px 0", textAlign: "center" }}
                >
                  {selectedStation.name}
                </Title>
                <div style={{ margin: "8px 0", textAlign: "center" }}>
                  {selectedStation.lines.map((lineId) => {
                    const line = subwayLines.find((l) => l.id === lineId);
                    return line ? (
                      <Tag
                        key={lineId}
                        color={line.color}
                        style={{ margin: "2px" }}
                      >
                        {line.name}
                      </Tag>
                    ) : null;
                  })}
                </div>
                {selectedStation.isTransfer && (
                  <div style={{ textAlign: "center" }}>
                    <Tag color="red" style={{ margin: "4px 0" }}>
                      환승역
                    </Tag>
                  </div>
                )}
                <Divider style={{ margin: "12px 0" }} />
                <Text
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {selectedStation.description}
                </Text>
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: "12px", textAlign: "center" }}
                  >
                    좌표: ({selectedStation.lat}, {selectedStation.lng})
                  </Text>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 맵 컨테이너 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          ref={mapContainerRef}
          style={{
            flex: 1,
            border: "2px solid #d9d9d9",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
            width: "100%",
          }}
        />

        {/* 범례 */}
        <Card size="small" style={{ marginTop: "8px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Text strong style={{ textAlign: "center" }}>
              노선 범례:
            </Text>
            {subwayLines.map((line) => (
              <span
                key={line.id}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "4px",
                    backgroundColor: line.color,
                    borderRadius: "2px",
                  }}
                ></div>
                <Text style={{ fontSize: "12px", textAlign: "center" }}>
                  {line.name}
                </Text>
              </span>
            ))}
            <Text
              type="secondary"
              style={{ fontSize: "12px", textAlign: "center" }}
            >
              • 큰 원: 환승역 | 작은 원: 일반역
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MetroMap;
