import 'package:flutter/material.dart';

class SpeedSlider extends StatelessWidget {
  final int speed;
  final Function(int) onSpeedChanged;

  const SpeedSlider({
    Key? key,
    required this.speed,
    required this.onSpeedChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF00D9FF).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Speed',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '$speed',
                style: const TextStyle(
                  color: Color(0xFF00D9FF),
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: const Color(0xFF00D9FF),
              inactiveTrackColor: const Color(0xFF00D9FF).withOpacity(0.2),
              thumbColor: const Color(0xFF00D9FF),
              overlayColor: const Color(0xFF00D9FF).withOpacity(0.3),
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 12),
              trackHeight: 6,
            ),
            child: Slider(
              value: speed.toDouble(),
              min: 0,
              max: 100,
              onChanged: (value) => onSpeedChanged(value.toInt()),
            ),
          ),
        ],
      ),
    );
  }
}
