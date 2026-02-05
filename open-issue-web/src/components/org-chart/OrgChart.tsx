import { faCompress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Stack } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import { MemberData } from 'pages/project/type';
import React, { useEffect, useRef, useState } from 'react';

const CARD_WIDTH = 160;
const CARD_HEIGHT = 100;
const MEMBER_CARD_HEIGHT = 80;
const DEPT_CARD_HEIGHT = 60;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 50;
const PADDING = 50;

interface OrgChartProps {
  members: MemberData[];
}

const OrgChartCanvas: React.FC<OrgChartProps> = ({ members }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zoom & Pan 상태
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  //  color
  // const { palette } = useTheme();

  // const MAIN_COLOR = palette.primary.main;
  // const SUB_COLOR = palette.primary.light;

  // Canvas 크기 설정 - 초기화 및 리사이징 시에만
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // ctx.scale(dpr, dpr);
        drawOrgChart(ctx);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [members]);

  // Canvas 다시 그리기 - scale, offset 변경 시
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawOrgChart(ctx);
  }, [scale, offset]);

  const drawOrgChart = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Transform 적용 (Zoom & Pan)
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // 1. 역할자 그룹화 (isMember가 false인 경우)
    const roleMembers = members.filter((m) => !m.isMember);

    // 2. 일반 멤버를 부서별로 그룹화
    const deptGroups = members
      .filter((m) => m.isMember)
      .reduce(
        (acc, member) => {
          const dept = member.departmentName || '미분류';
          if (!acc[dept]) acc[dept] = [];
          acc[dept].push(member);
          return acc;
        },
        {} as Record<string, MemberData[]>
      );

    const departments = Object.keys(deptGroups);

    let currentY = PADDING;
    const connections: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }> = [];

    const roleLevelPositions: Array<{ x: number; y: number; members: MemberData[] }> = [];

    // 역할자 배치 (상단에 한 줄로 배치)
    if (roleMembers.length > 0) {
      const totalWidth = roleMembers.length * CARD_WIDTH + (roleMembers.length - 1) * HORIZONTAL_GAP;
      let startX = (ctx.canvas.width / window.devicePixelRatio - totalWidth) / 2;

      const positions: Array<{ x: number; y: number }> = [];

      roleMembers.forEach((member) => {
        const x = startX;
        const y = currentY;
        positions.push({ x: x + CARD_WIDTH / 2, y: y + CARD_HEIGHT });

        drawRoleCard(ctx, member, x, y);
        startX += CARD_WIDTH + HORIZONTAL_GAP;
      });

      roleLevelPositions.push({
        x: ctx.canvas.width / window.devicePixelRatio / 2,
        y: currentY + CARD_HEIGHT,
        members: roleMembers
      });

      currentY += CARD_HEIGHT + VERTICAL_GAP;
    }

    // 부서 카드 배치
    const deptTotalWidth = departments.length * CARD_WIDTH + (departments.length - 1) * HORIZONTAL_GAP;
    let deptStartX = (ctx.canvas.width / window.devicePixelRatio - deptTotalWidth) / 2;
    const deptY = currentY;
    const deptPositions: Array<{ x: number; y: number; dept: string }> = [];

    departments.forEach((dept) => {
      const x = deptStartX;
      const y = deptY;

      drawDeptCard(ctx, dept, x, y);
      deptPositions.push({ x: x + CARD_WIDTH / 2, y: y + DEPT_CARD_HEIGHT, dept });

      deptStartX += CARD_WIDTH + HORIZONTAL_GAP;
    });

    // 역할자 마지막 레벨과 부서 연결
    if (roleLevelPositions.length > 0 && deptPositions.length > 0) {
      const lastRoleLevel = roleLevelPositions[roleLevelPositions.length - 1];

      // 마지막 레벨의 각 역할자 위치 계산
      const lastRoleMembers = lastRoleLevel.members;
      const totalWidth = lastRoleMembers.length * CARD_WIDTH + (lastRoleMembers.length - 1) * HORIZONTAL_GAP;
      let startX = (ctx.canvas.width / window.devicePixelRatio - totalWidth) / 2;

      const lastRolePositions: Array<{ x: number; y: number }> = [];
      lastRoleMembers.forEach(() => {
        lastRolePositions.push({
          x: startX + CARD_WIDTH / 2,
          y: lastRoleLevel.y
        });
        startX += CARD_WIDTH + HORIZONTAL_GAP;
      });

      // 각 역할자에서 부서로 연결
      lastRolePositions.forEach((rolePos) => {
        deptPositions.forEach((deptPos) => {
          connections.push({
            from: { x: rolePos.x, y: rolePos.y },
            to: { x: deptPos.x, y: deptY }
          });
        });
      });
    }

    currentY = deptY + DEPT_CARD_HEIGHT + VERTICAL_GAP;

    // 부서별 멤버 배치
    deptPositions.forEach((deptPos) => {
      const deptMembers = deptGroups[deptPos.dept];
      let memberY = currentY;

      deptMembers.forEach((member, idx) => {
        const x = deptPos.x - CARD_WIDTH / 2;
        const y = memberY;

        drawMemberCard(ctx, member, x, y);

        // 부서 카드와 첫 멤버 연결
        if (idx === 0) {
          connections.push({
            from: { x: deptPos.x, y: deptPos.y },
            to: { x: deptPos.x, y: y }
          });
        }

        memberY += MEMBER_CARD_HEIGHT + 20;
      });
    });

    // 모든 연결선 그리기
    connections.forEach((conn) => {
      drawConnection(ctx, conn.from, conn.to);
    });

    ctx.restore();
  };

  const drawRoleCard = (ctx: CanvasRenderingContext2D, member: MemberData, x: number, y: number) => {
    // 카드 배경
    ctx.beginPath();
    ctx.fillStyle = '#F23511';
    ctx.roundRect(x, y, CARD_WIDTH, CARD_HEIGHT, 10);
    ctx.fill();

    // 테두리
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.roundRect(x, y, CARD_WIDTH, CARD_HEIGHT, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';

    // 역할
    ctx.fillText(member.role, x + CARD_WIDTH / 2, y + 30);

    // 이름
    ctx.beginPath();
    ctx.font = '16px sans-serif';
    ctx.fillText(member.name, x + CARD_WIDTH / 2, y + 55);

    // 부서 (있는 경우)
    if (member.departmentName) {
      ctx.beginPath();
      ctx.font = '12px sans-serif';
      ctx.fillText(member.departmentName, x + CARD_WIDTH / 2, y + 75);
    }
  };

  const drawDeptCard = (ctx: CanvasRenderingContext2D, dept: string, x: number, y: number) => {
    // 카드 배경
    ctx.beginPath();
    ctx.fillStyle = '#A63A26';
    ctx.roundRect(x, y, CARD_WIDTH, DEPT_CARD_HEIGHT, 10);
    ctx.fill();

    // 테두리
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.roundRect(x, y, CARD_WIDTH, DEPT_CARD_HEIGHT, 10);
    ctx.stroke();

    // 부서명
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dept, x + CARD_WIDTH / 2, y + DEPT_CARD_HEIGHT / 2 + 5);
  };

  const drawMemberCard = (ctx: CanvasRenderingContext2D, member: MemberData, x: number, y: number) => {
    // 카드 배경
    ctx.beginPath();
    ctx.fillStyle = '#D9D9D9';
    ctx.roundRect(x, y, CARD_WIDTH, MEMBER_CARD_HEIGHT, 10);
    ctx.fill();

    // 테두리
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.roundRect(x, y, CARD_WIDTH, MEMBER_CARD_HEIGHT, 10);
    ctx.stroke();

    // 유저 아이콘 (원)
    ctx.beginPath();
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(x + 30, y + MEMBER_CARD_HEIGHT / 2, 15, 0, Math.PI * 2);
    ctx.fill();

    // 이름
    ctx.beginPath();
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(member.name, x + 55, y + MEMBER_CARD_HEIGHT / 2 - 5);

    // 직급
    ctx.beginPath();
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.fillText(member.position, x + 55, y + MEMBER_CARD_HEIGHT / 2 + 15);
  };

  const drawConnection = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    ctx.beginPath();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;

    if (from.x === to.x) {
      // 수직선
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
    } else {
      // 꺾은 선 (중간 지점 사용)
      const midY = (from.y + to.y) / 2;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(from.x, midY);
      ctx.lineTo(to.x, midY);
      ctx.lineTo(to.x, to.y);
    }

    ctx.stroke();
  };

  // 마우스 휠 줌 핸들러
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 줌 전 마우스 위치 (캔버스 좌표)
    const worldX = (mouseX - offset.x) / scale;
    const worldY = (mouseY - offset.y) / scale;

    // 줌 배율 조정
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(0.1, scale * delta), 5);

    // 줌 후에도 마우스 위치가 같은 곳을 가리키도록 오프셋 조정
    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = mouseY - worldY * newScale;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // 마우스 다운 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  // 마우스 무브 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;

    const newOffsetX = e.clientX - startPan.x;
    const newOffsetY = e.clientY - startPan.y;
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // 마우스 업 핸들러
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // 마우스 리브 핸들러
  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // 리셋 버튼 핸들러
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <>
      <Stack direction={'row'} spacing={1} width={'100%'} justifyContent={'flex-end'}>
        <CommonButton
          onClick={handleReset}
          title="리셋"
          icononly="true"
          icon={<FontAwesomeIcon icon={faCompress} />}
          size="small"
          variant="light"
        />
      </Stack>
      <Box>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: isPanning ? 'grabbing' : 'grab'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </Box>
    </>
  );
};

export default OrgChartCanvas;
