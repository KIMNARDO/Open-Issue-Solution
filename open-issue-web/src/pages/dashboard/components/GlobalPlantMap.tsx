import { useEffect, useState, MouseEvent } from 'react';
import { Box, Paper, Typography, IconButton, Dialog, DialogContent, Chip, Popover } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import { useIntl } from 'react-intl';
import { AlertTriangle, Maximize2, X, Clock, Zap, Users } from 'lucide-react';
import { PlantLocation } from '../dashboard.types';
import { OpenIssueType } from 'pages/qms/qms/open-issue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FIGMA_SHADOW =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

const STATUS_COLORS: Record<string, string> = {
  normal: '#52c41a',
  warning: '#faad14',
  critical: '#E41B23'
};

// 마커를 모두 포함하면서 컨테이너에 정확히 맞추기
const FitBounds = ({ plants, expanded }: { plants: PlantLocation[]; expanded: boolean }) => {
  const map = useMap();
  useEffect(() => {
    // Dialog 열릴 때 약간의 딜레이 후 사이즈 재계산
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (plants.length === 0) return;

      const bounds = L.latLngBounds(
        plants.map((p) => [p.coordinates[1], p.coordinates[0]] as [number, number])
      );
      // 패딩을 넉넉히 주어 마커가 잘리지 않도록
      map.fitBounds(bounds.pad(expanded ? 0.4 : 0.5), {
        animate: false,
        padding: expanded ? [40, 40] : [20, 20]
      });
    }, expanded ? 150 : 50);

    return () => clearTimeout(timer);
  }, [plants, map, expanded]);
  return null;
};

const IMPORTANCE_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  '5': { bg: '#ffe4e6', color: '#E41B23', label: '긴급' },
  '4': { bg: '#fff7ed', color: '#f97316', label: '지시' },
  '3': { bg: '#fef9c3', color: '#a16207', label: '상' },
  '2': { bg: '#dbeafe', color: '#3B82F6', label: '중' },
  '1': { bg: '#f0fdf4', color: '#52c41a', label: '하' }
};

interface GlobalPlantMapProps {
  plants: PlantLocation[];
  issues?: OpenIssueType[];
}

const GlobalPlantMap = ({ plants, issues = [] }: GlobalPlantMapProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantLocation | null>(null);

  const handleChipClick = (event: MouseEvent<HTMLElement>, plant: PlantLocation) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedPlant(plant);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setSelectedPlant(null);
  };

  // Filter issues for selected plant
  const plantIssues = selectedPlant
    ? issues.filter((i) => (i.productionSite || '') === selectedPlant.id)
    : [];

  const alertPlants = plants.filter((p) => p.status !== 'normal');
  const maxCount = Math.max(...plants.map((p) => p.issueCount), 1);
  const getMarkerRadius = (count: number, expanded: boolean) => {
    const base = expanded ? 12 : 8;
    const max = expanded ? 28 : 16;
    return Math.max(base, Math.min(max, (count / maxCount) * max));
  };

  const renderMap = (height: number | string, expanded: boolean) => (
    <MapContainer
      center={[25, 80]}
      zoom={2}
      minZoom={2}
      maxBounds={[[-90, -200], [90, 200]]}
      maxBoundsViscosity={1.0}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: expanded ? 0 : '0 0 12px 12px',
        background: '#dee2e6'
      }}
      scrollWheelZoom={expanded}
      dragging={expanded}
      zoomControl={expanded}
      attributionControl={false}
      doubleClickZoom={expanded}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <FitBounds plants={plants} expanded={expanded} />

      {/* Ripple rings for critical/warning plants */}
      {plants
        .filter((p) => p.status !== 'normal')
        .map((plant) => (
          <CircleMarker
            key={`ripple-${plant.id}`}
            center={[plant.coordinates[1], plant.coordinates[0]]}
            radius={getMarkerRadius(plant.issueCount, expanded) + 6}
            pathOptions={{
              className: `marker-ripple marker-ripple-${plant.status}`,
              fillColor: STATUS_COLORS[plant.status],
              fillOpacity: 0,
              color: STATUS_COLORS[plant.status],
              weight: 2
            }}
          />
        ))}

      {/* Main markers */}
      {plants.map((plant) => (
        <CircleMarker
          key={plant.id}
          center={[plant.coordinates[1], plant.coordinates[0]]}
          radius={getMarkerRadius(plant.issueCount, expanded)}
          pathOptions={{
            className: `marker-main marker-${plant.status}`,
            fillColor: STATUS_COLORS[plant.status],
            fillOpacity: 0.85,
            color: '#fff',
            weight: 2
          }}
        >
          <LeafletTooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 120 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                {formatMessage({ id: plant.nameKey })}
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>
                {formatMessage({ id: 'dash-plant-total' })}: <b>{plant.issueCount}</b>
              </div>
              <div style={{ fontSize: 12, color: '#3B82F6' }}>
                {formatMessage({ id: 'dash-plant-open' })}: {plant.openCount}
              </div>
              <div style={{ fontSize: 12, color: '#faad14' }}>
                {formatMessage({ id: 'dash-plant-delayed' })}: {plant.delayedCount}
              </div>
              <div style={{ fontSize: 12, color: '#E41B23' }}>
                {formatMessage({ id: 'dash-plant-critical' })}: {plant.criticalCount}
              </div>
            </div>
          </LeafletTooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );

  return (
    <>
      {/* Compact card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          width: '100%',
          transition: 'all 0.2s cubic-bezier(0.46, 0.03, 0.52, 0.96)',
          '&:hover': {
            boxShadow: FIGMA_SHADOW,
            borderColor: alpha('#3B82F6', 0.3)
          }
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, pt: 1.25, pb: 0.75 }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(44, 45, 48, 1)' }}>
              {formatMessage({ id: 'dash-global-map' })}
            </Typography>
            <Typography sx={{ fontSize: '0.5rem', color: 'rgba(125, 127, 130, 1)', mt: 0.15 }}>
              {plants.length} {formatMessage({ id: 'dash-plant-sites' })}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5} alignItems="center">
            {/* Legend */}
            {(['normal', 'warning', 'critical'] as const).map((status) => (
              <Box key={status} display="flex" alignItems="center" gap={0.25}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_COLORS[status] }} />
                <Typography sx={{ fontSize: '0.5rem', color: 'rgba(125, 127, 130, 1)' }}>
                  {formatMessage({ id: `dash-status-${status}` })}
                </Typography>
              </Box>
            ))}
            <IconButton
              size="small"
              onClick={() => setDialogOpen(true)}
              sx={{
                ml: 0.25,
                width: 22,
                height: 22,
                color: 'rgba(125, 127, 130, 1)',
                '&:hover': { color: '#3B82F6', backgroundColor: 'rgba(239, 246, 255, 1)' }
              }}
            >
              <Maximize2 size={12} />
            </IconButton>
          </Box>
        </Box>

        {/* Mini Map */}
        <Box sx={{ height: 200 }}>
          {renderMap(200, false)}
        </Box>

        {/* Alert Bar (compact) */}
        {alertPlants.length > 0 && (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha('#faad14', 0.06),
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: 'wrap'
            }}
          >
            <AlertTriangle size={11} color="#faad14" />
            {alertPlants.slice(0, 3).map((plant) => (
              <Typography
                key={plant.id}
                sx={{ fontSize: '0.5625rem', fontWeight: 600, color: STATUS_COLORS[plant.status] }}
              >
                {formatMessage({ id: plant.nameKey })}
                ({plant.status === 'critical' ? plant.criticalCount : plant.delayedCount})
              </Typography>
            ))}
          </Box>
        )}
      </Paper>

      {/* Expanded Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            maxHeight: '85vh'
          }
        }}
      >
        {/* Dialog Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
              {formatMessage({ id: 'dash-global-map' })}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(125, 127, 130, 1)', mt: 0.25 }}>
              {plants.length} {formatMessage({ id: 'dash-plant-sites' })}
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} alignItems="center">
            {(['normal', 'warning', 'critical'] as const).map((status) => (
              <Box key={status} display="flex" alignItems="center" gap={0.5}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: STATUS_COLORS[status] }} />
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(125, 127, 130, 1)' }}>
                  {formatMessage({ id: `dash-status-${status}` })}
                </Typography>
              </Box>
            ))}
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Large Map */}
          <Box sx={{ height: '55vh', minHeight: 400 }}>
            {dialogOpen && renderMap('100%', true)}
          </Box>

          {/* Plant Summary Grid — clickable chips */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap'
            }}
          >
            {plants.map((plant) => (
              <Chip
                key={plant.id}
                onClick={(e) => handleChipClick(e, plant)}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: STATUS_COLORS[plant.status] }} />
                    <span>{formatMessage({ id: plant.nameKey })}</span>
                    <b>{plant.issueCount}</b>
                    {plant.delayedCount > 0 && (
                      <span style={{ color: '#faad14', fontSize: '0.7rem' }}>({plant.delayedCount})</span>
                    )}
                  </Box>
                }
                variant="outlined"
                size="small"
                sx={{
                  cursor: 'pointer',
                  borderColor: alpha(STATUS_COLORS[plant.status], 0.3),
                  backgroundColor: selectedPlant?.id === plant.id
                    ? alpha(STATUS_COLORS[plant.status], 0.12)
                    : alpha(STATUS_COLORS[plant.status], 0.04),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(STATUS_COLORS[plant.status], 0.1),
                    borderColor: alpha(STATUS_COLORS[plant.status], 0.5),
                    transform: 'translateY(-1px)'
                  },
                  '& .MuiChip-label': { fontSize: '0.75rem' }
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Plant Issue List Popover */}
      <Popover
        open={Boolean(popoverAnchor) && Boolean(selectedPlant)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: FIGMA_SHADOW,
              border: `1px solid ${theme.palette.divider}`,
              width: 420,
              maxHeight: 400,
              overflow: 'hidden'
            }
          }
        }}
      >
        {selectedPlant && (
          <Box>
            {/* Popover Header */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: alpha(STATUS_COLORS[selectedPlant.status], 0.04)
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLORS[selectedPlant.status]
                  }}
                />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(44, 45, 48, 1)' }}>
                  {formatMessage({ id: selectedPlant.nameKey })}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Chip
                  size="small"
                  icon={<Users size={10} />}
                  label={`${selectedPlant.openCount} ${formatMessage({ id: 'dash-plant-open' })}`}
                  sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, backgroundColor: '#dbeafe', color: '#3B82F6', '& .MuiChip-icon': { color: '#3B82F6' } }}
                />
                {selectedPlant.delayedCount > 0 && (
                  <Chip
                    size="small"
                    icon={<Clock size={10} />}
                    label={`${selectedPlant.delayedCount} ${formatMessage({ id: 'dash-plant-delayed' })}`}
                    sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, backgroundColor: '#fef9c3', color: '#a16207', '& .MuiChip-icon': { color: '#a16207' } }}
                  />
                )}
                {selectedPlant.criticalCount > 0 && (
                  <Chip
                    size="small"
                    icon={<Zap size={10} />}
                    label={`${selectedPlant.criticalCount} ${formatMessage({ id: 'dash-plant-critical' })}`}
                    sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, backgroundColor: '#ffe4e6', color: '#E41B23', '& .MuiChip-icon': { color: '#E41B23' } }}
                  />
                )}
              </Box>
            </Box>

            {/* Issue List */}
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {plantIssues.length === 0 ? (
                <Typography sx={{ p: 2, textAlign: 'center', fontSize: '0.75rem', color: 'rgba(125, 127, 130, 1)' }}>
                  {formatMessage({ id: 'dash-no-issues' })}
                </Typography>
              ) : (
                plantIssues.map((issue, idx) => {
                  const imp = IMPORTANCE_COLORS[issue.importance] || IMPORTANCE_COLORS['2'];
                  return (
                    <Box
                      key={issue.oid}
                      sx={{
                        px: 2,
                        py: 1,
                        borderBottom: idx < plantIssues.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'background-color 0.15s ease',
                        '&:hover': { backgroundColor: 'rgba(250, 250, 251, 1)' }
                      }}
                    >
                      {/* Importance badge */}
                      <Box
                        sx={{
                          px: 0.75,
                          py: 0.15,
                          borderRadius: '4px',
                          fontSize: '0.5625rem',
                          fontWeight: 700,
                          backgroundColor: imp.bg,
                          color: imp.color,
                          flexShrink: 0,
                          minWidth: 24,
                          textAlign: 'center'
                        }}
                      >
                        {imp.label}
                      </Box>

                      {/* Issue No */}
                      <Typography
                        sx={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: '#3B82F6',
                          flexShrink: 0,
                          minWidth: 50
                        }}
                      >
                        {issue.issueNo || '-'}
                      </Typography>

                      {/* Contents */}
                      <Typography
                        sx={{
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: 'rgba(44, 45, 48, 1)',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {(issue.description || issue.contents || '').split('\n')[0]}
                      </Typography>

                      {/* Status */}
                      <Typography
                        sx={{
                          fontSize: '0.5625rem',
                          fontWeight: 600,
                          color: issue.issueStateNm === '완료' ? '#52c41a' : issue.issueStateNm === '대기' ? '#faad14' : '#3B82F6',
                          flexShrink: 0
                        }}
                      >
                        {issue.issueStateNm || ''}
                      </Typography>

                      {/* Team */}
                      <Typography
                        sx={{
                          fontSize: '0.5625rem',
                          color: 'rgba(125, 127, 130, 1)',
                          flexShrink: 0,
                          maxWidth: 60,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {issue.managerTeam || ''}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        )}
      </Popover>

      {/* Marker Animation CSS */}
      <style>{`
        @keyframes markerPulseCritical {
          0%, 100% { stroke-opacity: 0.85; fill-opacity: 0.85; }
          50% { stroke-opacity: 0.5; fill-opacity: 0.6; }
        }
        @keyframes markerPulseWarning {
          0%, 100% { stroke-opacity: 0.85; fill-opacity: 0.85; }
          50% { stroke-opacity: 0.6; fill-opacity: 0.7; }
        }
        @keyframes markerRipple {
          0% { stroke-opacity: 0.6; stroke-width: 2; }
          50% { stroke-opacity: 0.2; stroke-width: 4; }
          100% { stroke-opacity: 0; stroke-width: 6; }
        }
        .marker-critical {
          animation: markerPulseCritical 1.5s ease-in-out infinite;
        }
        .marker-warning {
          animation: markerPulseWarning 2.5s ease-in-out infinite;
        }
        .marker-normal {
          transition: fill-opacity 0.3s ease;
        }
        .marker-ripple-critical {
          animation: markerRipple 2s ease-out infinite;
        }
        .marker-ripple-warning {
          animation: markerRipple 3s ease-out infinite;
        }
      `}</style>
    </>
  );
};

export default GlobalPlantMap;
