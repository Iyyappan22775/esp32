import 'package:flutter/material.dart';

class DirectionPad extends StatelessWidget {
  final Function(String) onDirectionPress;
  final VoidCallback onDirectionRelease;

  const DirectionPad({
    Key? key,
    required this.onDirectionPress,
    required this.onDirectionRelease,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      height: 280,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer ring
          Container(
            width: 280,
            height: 280,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: const Color(0xFF00D9FF).withOpacity(0.3),
                width: 2,
              ),
            ),
          ),
          
          // Inner gradient ring
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF0066FF).withOpacity(0.3),
                  const Color(0xFF00D9FF).withOpacity(0.1),
                  Colors.transparent,
                ],
              ),
            ),
          ),
          
          // Center logo
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF1A1F3A),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF00D9FF).withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Icon(
              Icons.smart_toy,
              color: Color(0xFF00D9FF),
              size: 40,
            ),
          ),
          
          // Direction buttons
          Positioned(
            top: 0,
            child: _buildDirectionButton(
              icon: Icons.arrow_upward,
              direction: 'forward',
            ),
          ),
          Positioned(
            bottom: 0,
            child: _buildDirectionButton(
              icon: Icons.arrow_downward,
              direction: 'backward',
            ),
          ),
          Positioned(
            left: 0,
            child: _buildDirectionButton(
              icon: Icons.arrow_back,
              direction: 'left',
            ),
          ),
          Positioned(
            right: 0,
            child: _buildDirectionButton(
              icon: Icons.arrow_forward,
              direction: 'right',
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildDirectionButton({
    required IconData icon,
    required String direction,
  }) {
    return GestureDetector(
      onTapDown: (_) => onDirectionPress(direction),
      onTapUp: (_) => onDirectionRelease(),
      onTapCancel: onDirectionRelease,
      child: _DirectionButton(icon: icon),
    );
  }
}

class _DirectionButton extends StatefulWidget {
  final IconData icon;

  const _DirectionButton({required this.icon});

  @override
  State<_DirectionButton> createState() => _DirectionButtonState();
}

class _DirectionButtonState extends State<_DirectionButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: LinearGradient(
            colors: _isPressed
                ? [const Color(0xFF00D9FF), const Color(0xFF0066FF)]
                : [const Color(0xFF1A1F3A), const Color(0xFF0A0E27)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: _isPressed
                  ? const Color(0xFF00D9FF).withOpacity(0.6)
                  : Colors.black.withOpacity(0.3),
              blurRadius: _isPressed ? 20 : 10,
              spreadRadius: _isPressed ? 2 : 0,
            ),
          ],
        ),
        child: Icon(
          widget.icon,
          color: _isPressed ? Colors.white : const Color(0xFF00D9FF),
          size: 28,
        ),
      ),
    );
  }
}
