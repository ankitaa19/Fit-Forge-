import 'package:flutter/material.dart';

class Responsive {
  static const double mobileBreakpoint = 600;
  static const double tabletBreakpoint = 900;

  static bool isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < mobileBreakpoint;
  }

  static bool isNarrow(BuildContext context) {
    return MediaQuery.of(context).size.width < tabletBreakpoint;
  }

  static EdgeInsets pagePadding(
    BuildContext context, {
    EdgeInsets mobile = const EdgeInsets.all(16),
    EdgeInsets desktop = const EdgeInsets.all(32),
  }) {
    return isNarrow(context) ? mobile : desktop;
  }

  static double dialogWidth(BuildContext context, double maxWidth) {
    final width = MediaQuery.of(context).size.width;
    final available = width - 32;
    return available.clamp(0.0, maxWidth).toDouble();
  }

  static int gridCount(
    double width, {
    double minTileWidth = 240,
    int minCount = 1,
    int maxCount = 4,
  }) {
    final count = (width / minTileWidth).floor();
    if (count < minCount) return minCount;
    if (count > maxCount) return maxCount;
    return count;
  }
}
