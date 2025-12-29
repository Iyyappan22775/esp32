import 'package:flutter/material.dart';
import 'dart:async';

class StatusBar extends StatefulWidget {
  final bool isConnected;
  final int batteryLevel;
  final VoidCallback onRefresh;

  const StatusBar({
    Key? key,
    required this.isConnected,
    required this.batteryLevel,
    required this.onRefresh,
  }) : super(key: key);

  @override
  State<StatusBar> createState() => _StatusBarState();
}

class _StatusBarState extends State<StatusBar> with SingleTickerProviderStateMixin {
  late AnimationController _blinkController;
  
  @override
  void initState() {
    super.initState();
    _blinkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
  }
  
  @override
  void dispose() {
    _blinkController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Logo placeholder
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF00D9FF).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.smart_toy,
              color: Color(0xFF00D9FF),
              size: 24,
            ),
          ),
          
          const Spacer(),
          
          // Battery indicator
          _buildBatteryIndicator(),
          
          const SizedBox(width: 16),
          
          // WiFi status
          _buildWiFiIndicator(),
          
          const SizedBox(width: 16),
          
          // Refresh button
          InkWell(
            onTap: widget.onRefresh,
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF00D9FF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.refresh,
                color: Color(0xFF00D9FF),
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildBatteryIndicator() {
    Color batteryColor;
    if (widget.batteryLevel > 60) {
      batteryColor = Colors.green;
    } else if (widget.batteryLevel > 30) {
      batteryColor = Colors.orange;
    } else {
      batteryColor = Colors.red;
    }
    
    return Row(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            Icon(
              Icons.battery_std,
              color: batteryColor,
              size: 28,
            ),
            Positioned(
              child: Text(
                '${widget.batteryLevel}',
                style: const TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(width: 4),
        Text(
          '${widget.batteryLevel}%',
          style: TextStyle(
            color: batteryColor,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
  
  Widget _buildWiFiIndicator() {
    if (widget.isConnected) {
      return FadeTransition(
        opacity: _blinkController,
        child: const Icon(
          Icons.wifi,
          color: Colors.green,
          size: 24,
        ),
      );
    } else {
      return const Icon(
        Icons.wifi_off,
        color: Colors.red,
        size: 24,
      );
    }
  }
}
