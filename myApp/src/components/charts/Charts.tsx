import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Type } from '../../theme/theme';

const SCREEN_W = Dimensions.get('window').width;

// ─── Sparkline (mini inline line chart) ──────────────────────────────────────
export function Sparkline({ data, color = Colors.accent, height = 40, width }) {
  const W = width || SCREEN_W - Spacing.screenH * 2 - Spacing.md * 2 - 8;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const PAD = 4;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (W - PAD * 2) + PAD,
    y: (height - PAD * 2) - ((v - min) / range) * (height - PAD * 2) + PAD,
  }));

  return (
    <View style={{ width: W, height, position: 'relative' }}>
      {/* Area fill */}
      {pts.map((pt, i) => {
        const colW = i < pts.length - 1 ? pts[i + 1].x - pt.x + 1 : W - pt.x;
        return (
          <View
            key={'fill' + i}
            style={{
              position: 'absolute',
              left: pt.x,
              top: pt.y,
              width: colW,
              height: height - pt.y,
              backgroundColor: color + '22',
            }}
          />
        );
      })}

      {/* Line segments */}
      {pts.slice(0, -1).map((pt, i) => {
        const next = pts[i + 1];
        const dx = next.x - pt.x;
        const dy = next.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const H = 2;
        const tx = (len / 2) * (Math.cos(angle) - 1);
        const ty = (len / 2) * Math.sin(angle) - H / 2;
        return (
          <View
            key={'seg' + i}
            style={{
              position: 'absolute',
              left: pt.x,
              top: pt.y,
              width: len,
              height: H,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ translateX: tx }, { translateY: ty }, { rotate: `${angle * 180 / Math.PI}deg` }],
            }}
          />
        );
      })}

      {/* Endpoint dot */}
      {pts.length > 0 && (
        <View
          style={{
            position: 'absolute',
            left: pts[pts.length - 1].x - 4,
            top: pts[pts.length - 1].y - 4,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            borderWidth: 2,
            borderColor: Colors.bgCard,
          }}
        />
      )}
    </View>
  );
}

// ─── Full Line Chart with axes ─────────────────────────────────────────────────
export function LineChart({ data, labels, color = Colors.accent, height = 160 }) {
  const W = SCREEN_W - Spacing.screenH * 2 - Spacing.md * 2;
  const PLOT_W = W - 32; // room for y labels
  const PLOT_H = height - 24; // room for x labels
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const PAD = 6;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (PLOT_W - PAD * 2) + PAD,
    y: (PLOT_H - PAD * 2) - ((v - min) / range) * (PLOT_H - PAD * 2) + PAD,
  }));

  const gridY = [0, 0.5, 1].map(pct => ({
    y: (PLOT_H - PAD * 2) - pct * (PLOT_H - PAD * 2) + PAD,
    val: Math.round(min + pct * range),
  }));

  return (
    <View style={{ height: height }}>
      {/* Y-labels */}
      {gridY.map(g => (
        <Text key={g.val} style={[styles.axisLabel, { position: 'absolute', left: 0, top: g.y - 6, width: 28, textAlign: 'right' }]}>
          {g.val}
        </Text>
      ))}

      {/* Plot area */}
      <View style={{ position: 'absolute', left: 32, top: 0, width: PLOT_W, height: PLOT_H }}>
        {/* Grid lines */}
        {gridY.map(g => (
          <View key={'g' + g.val} style={[styles.gridLine, { top: g.y, width: PLOT_W }]} />
        ))}

        {/* Area fill */}
        {pts.map((pt, i) => {
          const colW = i < pts.length - 1 ? pts[i + 1].x - pt.x + 1 : PLOT_W - pt.x;
          return (
            <View
              key={'fill' + i}
              style={{
                position: 'absolute',
                left: pt.x,
                top: pt.y,
                width: colW,
                height: PLOT_H - pt.y,
                backgroundColor: color + '1A',
              }}
            />
          );
        })}

        {/* Line segments */}
        {pts.slice(0, -1).map((pt, i) => {
          const next = pts[i + 1];
          const dx = next.x - pt.x;
          const dy = next.y - pt.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const H = 2.5;
          const tx = (len / 2) * (Math.cos(angle) - 1);
          const ty = (len / 2) * Math.sin(angle) - H / 2;
          return (
            <View
              key={'seg' + i}
              style={{
                position: 'absolute',
                left: pt.x,
                top: pt.y,
                width: len,
                height: H,
                backgroundColor: color,
                borderRadius: H / 2,
                transform: [{ translateX: tx }, { translateY: ty }, { rotate: `${angle * 180 / Math.PI}deg` }],
              }}
            />
          );
        })}

        {/* Dots */}
        {pts.map((pt, i) => (
          <View key={'dot' + i} style={[styles.dot, { left: pt.x - 4, top: pt.y - 4, borderColor: color, backgroundColor: color }]} />
        ))}
      </View>

      {/* X labels */}
      {labels && (
        <View style={{ position: 'absolute', bottom: 0, left: 32, width: PLOT_W, flexDirection: 'row', justifyContent: 'space-between' }}>
          {labels.map(l => (
            <Text key={l} style={styles.axisLabel}>{l}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Grouped Bar Chart ─────────────────────────────────────────────────────────
export function BarChart({ groups, colors, labels, height = 160 }) {
  // groups: [{ a: 65, b: 35 }, ...]
  // colors: ['#50CBA0', '#F07272']
  const maxVal = 100;
  const PLOT_H = height - 24;

  return (
    <View>
      <View style={{ flexDirection: 'row', height: PLOT_H }}>
        {/* Y labels */}
        <View style={{ width: 28, justifyContent: 'space-between', paddingBottom: 4 }}>
          {[100, 50, 0].map(v => (
            <Text key={v} style={[styles.axisLabel, { textAlign: 'right', paddingRight: 5 }]}>{v}</Text>
          ))}
        </View>

        {/* Bars */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', position: 'relative' }}>
          {[0, 50, 100].map(pct => (
            <View key={pct} style={[styles.gridLine, {
              position: 'absolute',
              bottom: (pct / maxVal) * (PLOT_H - 6),
              left: 0, right: 0,
            }]} />
          ))}

          {groups.map((group, gi) => {
            const vals = Object.values(group);
            return (
              <View key={gi} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4 }}>
                {vals.map((v, vi) => (
                  <View
                    key={vi}
                    style={{
                      width: 13,
                      height: Math.max(4, (v / maxVal) * (PLOT_H - 10)),
                      backgroundColor: colors[vi] || Colors.accent,
                      borderRadius: 4,
                    }}
                  />
                ))}
              </View>
            );
          })}
        </View>
      </View>

      {/* X labels + legend */}
      {labels && (
        <View style={{ flexDirection: 'row', paddingLeft: 28, marginTop: 6 }}>
          {labels.map(l => (
            <Text key={l} style={[styles.axisLabel, { flex: 1, textAlign: 'center' }]}>{l}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  axisLabel: {
    ...Type.caption,
    fontSize: 9,
    color: Colors.textTertiary,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});