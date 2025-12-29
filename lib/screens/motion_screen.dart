import 'package:flutter/material.dart';
import 'dart:async';
import '../services/esp8266_service.dart';
import '../widgets/status_bar.dart';
import '../widgets/eyes_selector.dart';
import '../widgets/mode_action_selector.dart';
import '../widgets/direction_pad.dart';
import '../widgets/speed_slider.dart';

class MotionScreen extends StatefulWidget {
  const MotionScreen({Key? key}) : super(key: key);

  @override
  State<MotionScreen> createState() => _MotionScreenState();
}

class _MotionScreenState extends State<MotionScreen> {
  final ESP8266Service _service = ESP8266Service();
  
  bool _isConnected = false;
  int _batteryLevel = 0;
  int _selectedEye = 1;
  int _selectedMode = 1;
  String _selectedAction = 'A';
  bool _runEnabled = false;
  bool _loopEnabled = false;
  int _speed = 50;
  Timer? _statusTimer;
  
  @override
  void initState() {
    super.initState();
    _checkStatus();
    _statusTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      _checkStatus();
    });
  }
  
  @override
  void dispose() {
    _statusTimer?.cancel();
    super.dispose();
  }
  
  Future<void> _checkStatus() async {
    final status = await _service.checkConnection();
    setState(() {
      _isConnected = status['connected'] ?? false;
      _batteryLevel = status['battery'] ?? 0;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Status Bar
            StatusBar(
              isConnected: _isConnected,
              batteryLevel: _batteryLevel,
              onRefresh: _checkStatus,
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Eyes Selector
                    EyesSelector(
                      selectedEye: _selectedEye,
                      onEyeSelected: (eye) {
                        setState(() => _selectedEye = eye);
                        _service.setEyes(eye);
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Mode & Action Selector
                    ModeActionSelector(
                      selectedMode: _selectedMode,
                      selectedAction: _selectedAction,
                      runEnabled: _runEnabled,
                      loopEnabled: _loopEnabled,
                      onModeChanged: (mode) {
                        setState(() {
                          _selectedMode = mode;
                          _selectedAction = 'A';
                        });
                        _service.setMode(mode);
                      },
                      onActionChanged: (action) {
                        setState(() => _selectedAction = action);
                        _service.setAction(action);
                      },
                      onRunChanged: (value) {
                        setState(() => _runEnabled = value);
                        _service.setRun(value);
                      },
                      onLoopChanged: (value) {
                        setState(() => _loopEnabled = value);
                        _service.setLoop(value);
                      },
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Direction Pad
                    DirectionPad(
                      onDirectionPress: _service.startMove,
                      onDirectionRelease: _service.stopMove,
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Speed Slider
                    SpeedSlider(
                      speed: _speed,
                      onSpeedChanged: (value) {
                        setState(() => _speed = value);
                        _service.setSpeed(value);
                      },
                    ),
                  ],
                ),
              ),
            ),
            
            // Bottom Navigation
            _buildBottomNav(),
          ],
        ),
      ),
    );
  }
  
  Widget _buildBottomNav() {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(Icons.control_camera, 'Motion', true),
          _buildNavItem(Icons.touch_app, 'Action', false),
        ],
      ),
    );
  }
  
  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          color: isActive ? const Color(0xFF00D9FF) : Colors.grey,
          size: 28,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: isActive ? const Color(0xFF00D9FF) : Colors.grey,
            fontSize: 12,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}
