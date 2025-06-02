import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MetroMap from "./MetroMap";

// 지하철 역 아이콘 생성
const createStationMarker = (color: string, isTransfer: boolean = false) => {
  const size = isTransfer ? 16 : 12;
  const borderWidth = isTransfer ? 4 : 3;

  return L.divIcon({
    className: "station-marker",
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background-color: ${color}; 
      border: ${borderWidth}px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      ${isTransfer ? "border-color: #333; background: white;" : ""}
    "></div>`,
    iconSize: [size + borderWidth * 2, size + borderWidth * 2],
    iconAnchor: [(size + borderWidth * 2) / 2, (size + borderWidth * 2) / 2],
  });
};

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lines: string[];
  isTransfer: boolean;
  description: string;
}

export interface SubwayLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
  coordinates: [number, number][];
}

// 지하철 노선 정의
const subwayLines: SubwayLine[] = [
  {
    id: "1",
    name: "1호선",
    color: "#0052A4",
    stations: ["101", "102", "103", "104", "105", "106"],
    coordinates: [
      [50, 50],
      [60, 60],
      [70, 70],
      [80, 80],
      [90, 90],
      [100, 100],
    ],
  },
  {
    id: "2",
    name: "2호선",
    color: "#00A84D",
    stations: ["201", "102", "202", "203", "105", "204"],
    coordinates: [
      [40, 80],
      [60, 60],
      [80, 40],
      [100, 30],
      [90, 90],
      [110, 110],
    ],
  },
  {
    id: "3",
    name: "3호선",
    color: "#EF7C1C",
    stations: ["301", "302", "104", "303", "304", "305"],
    coordinates: [
      [30, 50],
      [50, 70],
      [80, 80],
      [110, 90],
      [130, 100],
      [150, 110],
    ],
  },
  {
    id: "4",
    name: "4호선",
    color: "#00A5DE",
    stations: ["401", "402", "203", "403", "404"],
    coordinates: [
      [120, 40],
      [110, 50],
      [100, 30],
      [90, 20],
      [80, 10],
    ],
  },
];

// 지하철 역 정의
const stations: Station[] = [
  // 1호선 역들
  {
    id: "101",
    name: "메트로 센터",
    lat: 50,
    lng: 50,
    lines: ["1"],
    isTransfer: false,
    description: "1호선 시작역, 쇼핑몰 연결",
  },
  {
    id: "102",
    name: "시청역",
    lat: 60,
    lng: 60,
    lines: ["1", "2"],
    isTransfer: true,
    description: "시청 및 관공서 지역",
  },
  {
    id: "103",
    name: "대학로",
    lat: 70,
    lng: 70,
    lines: ["1"],
    isTransfer: false,
    description: "주요 대학가, 문화의 거리",
  },
  {
    id: "104",
    name: "중앙역",
    lat: 80,
    lng: 80,
    lines: ["1", "3"],
    isTransfer: true,
    description: "기차역 연결, 교통 허브",
  },
  {
    id: "105",
    name: "비즈니스 파크",
    lat: 90,
    lng: 90,
    lines: ["1", "2"],
    isTransfer: true,
    description: "주요 업무지구",
  },
  {
    id: "106",
    name: "공항터미널",
    lat: 100,
    lng: 100,
    lines: ["1"],
    isTransfer: false,
    description: "국제공항 연결",
  },

  // 2호선 전용 역들
  {
    id: "201",
    name: "스포츠 컴플렉스",
    lat: 40,
    lng: 80,
    lines: ["2"],
    isTransfer: false,
    description: "종합 스포츠 시설",
  },
  {
    id: "202",
    name: "아트센터",
    lat: 80,
    lng: 40,
    lines: ["2"],
    isTransfer: false,
    description: "문화예술 복합단지",
  },
  {
    id: "203",
    name: "테크밸리",
    lat: 100,
    lng: 30,
    lines: ["2", "4"],
    isTransfer: true,
    description: "IT 기업 집중지역",
  },
  {
    id: "204",
    name: "신도심",
    lat: 110,
    lng: 110,
    lines: ["2"],
    isTransfer: false,
    description: "신규 개발지역",
  },

  // 3호선 전용 역들
  {
    id: "301",
    name: "역사박물관",
    lat: 30,
    lng: 50,
    lines: ["3"],
    isTransfer: false,
    description: "역사 문화 지구",
  },
  {
    id: "302",
    name: "시장거리",
    lat: 50,
    lng: 70,
    lines: ["3"],
    isTransfer: false,
    description: "전통 시장과 상가",
  },
  {
    id: "303",
    name: "의료센터",
    lat: 110,
    lng: 90,
    lines: ["3"],
    isTransfer: false,
    description: "종합병원 및 의료시설",
  },
  {
    id: "304",
    name: "주거단지",
    lat: 130,
    lng: 100,
    lines: ["3"],
    isTransfer: false,
    description: "대규모 아파트 단지",
  },
  {
    id: "305",
    name: "자연공원",
    lat: 150,
    lng: 110,
    lines: ["3"],
    isTransfer: false,
    description: "도심 속 자연공원",
  },

  // 4호선 전용 역들
  {
    id: "401",
    name: "금융가",
    lat: 120,
    lng: 40,
    lines: ["4"],
    isTransfer: false,
    description: "은행 및 금융기관 밀집",
  },
  {
    id: "402",
    name: "컨벤션센터",
    lat: 110,
    lng: 50,
    lines: ["4"],
    isTransfer: false,
    description: "국제 전시 및 컨벤션",
  },
  {
    id: "403",
    name: "산업단지",
    lat: 90,
    lng: 20,
    lines: ["4"],
    isTransfer: false,
    description: "제조업 및 물류센터",
  },
  {
    id: "404",
    name: "항만터미널",
    lat: 80,
    lng: 10,
    lines: ["4"],
    isTransfer: false,
    description: "화물 항만 및 물류",
  },
];

const MetroMapContainer = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const transferStations = stations.filter((s) => s.isTransfer);

  // 맵 초기화 및 데이터 렌더링
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 지하철 노선도용 맵 생성
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 4,
      center: [85, 75],
      zoom: 1,
    });

    // 지하철 노선도 스타일 배경
    L.tileLayer(
      "data:image/svg+xml;base64," +
        btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="256" height="256" fill="#fafafa"/>
        <rect width="256" height="256" fill="url(#grid)"/>
      </svg>
    `),
      {
        attribution: "Metro City Subway Map",
      }
    ).addTo(map);

    mapRef.current = map;

    // 노선별로 선 그리기
    subwayLines.forEach((line) => {
      const polyline = L.polyline(line.coordinates, {
        color: line.color,
        weight: 8,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polyline.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: ${line.color};">${line.name}</h3>
          <p style="margin: 0; font-size: 14px;">총 ${line.stations.length}개 역</p>
        </div>
      `);

      polyline.on("click", () => {
        setSelectedLine(line.id);
      });
    });

    // 역들 그리기
    stations.forEach((station) => {
      const primaryLine = subwayLines.find((line) =>
        line.stations.includes(station.id)
      );
      const color = primaryLine ? primaryLine.color : "#666666";

      const marker = L.marker([station.lat, station.lng], {
        icon: createStationMarker(color, station.isTransfer),
      }).addTo(map);

      const linesInfo = station.lines
        .map((lineId) => {
          const line = subwayLines.find((l) => l.id === lineId);
          return line
            ? `<span style="color: ${line.color}; font-weight: bold;">${line.name}</span>`
            : "";
        })
        .join(" • ");

      marker.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #333;">${station.name}</h3>
          <div style="margin: 4px 0; font-size: 14px;">${linesInfo}</div>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">${
            station.description
          }</p>
          ${
            station.isTransfer
              ? '<div style="margin-top: 8px;"><span style="background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">환승역</span></div>'
              : ""
          }
        </div>
      `);

      marker.on("click", () => {
        setSelectedStation(station);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 이벤트 핸들러들
  const zoomToStation = (station: Station) => {
    if (mapRef.current) {
      mapRef.current.setView([station.lat, station.lng], 3);
      setSelectedStation(station);
    }
  };

  const highlightLine = (lineId: string) => {
    setSelectedLine(lineId);
    if (mapRef.current) {
      const line = subwayLines.find((l) => l.id === lineId);
      if (line) {
        const bounds = L.latLngBounds(line.coordinates);
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([85, 75], 1);
      setSelectedStation(null);
      setSelectedLine(null);
    }
  };

  return (
    <MetroMap
      mapContainerRef={mapContainerRef}
      selectedStation={selectedStation}
      selectedLine={selectedLine}
      subwayLines={subwayLines}
      transferStations={transferStations}
      zoomToStation={zoomToStation}
      highlightLine={highlightLine}
      resetView={resetView}
    />
  );
};

export default MetroMapContainer;
