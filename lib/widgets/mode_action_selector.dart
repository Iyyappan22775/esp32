import 'package:flutter/material.dart';

class ModeActionSelector extends StatelessWidget {
  final int selectedMode;
  final String selectedAction;
  final bool runEnabled;
  final bool loopEnabled;
  final Function(int) onModeChanged;
  final Function(String) onActionChanged;
  final Function(bool) onRunChanged;
  final Function(bool) onLoopChanged;

  const ModeActionSelector({
    Key? key,
    required this.selectedMode,
    required this.selectedAction,
    required this.runEnabled,
    required this.loopEnabled,
    required this.onModeChanged,
    required this.onActionChanged,
    required this.onRunChanged,
    required this.onLoopChanged,
  }) : super(key: key);

  Map<String, String> _getActionsForMode(int mode) {
    switch (mode) {
      case 1:
        return {
          'A': 'Dancing',
          'B': 'Handshaking',
          'C': 'Salute',
        };
      case 2:
        return {
          'A': 'Circle Movement',
          'B': 'Zig-zag Movement',
          'C': 'Stop & Blink',
        };
      case 3:
        return {
          'A': 'Fast Wave',
          'B': 'Slow Wave',
          'C': 'Greeting "Vanakkam"',
        };
      default:
        return {};
    }
  }

  @override
  Widget build(BuildContext context) {
    final actions = _getActionsForMode(selectedMode);
    
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildDropdown(
                label: 'Mode',
                value: selectedMode,
                items: const {
                  1: 'Mode 1 - Gestures',
                  2: 'Mode 2 - Movement',
                  3: 'Mode 3 - Special',
                },
                onChanged: (value) => onModeChanged(value!),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildDropdown(
                label: 'Action',
                value: selectedAction,
                items: actions,
                onChanged: (value) => onActionChanged(value!),
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 16),
        
        Row(
          children: [
            Expanded(
              child: _buildToggleDropdown(
                label: 'Run',
                value: runEnabled,
                onChanged: onRunChanged,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildToggleDropdown(
                label: 'Loop',
                value: loopEnabled,
                onChanged: onLoopChanged,
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildDropdown<T>({
    required String label,
    required T value,
    required Map<T, String> items,
    required Function(T?) onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF00D9FF).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 10,
            ),
          ),
          DropdownButton<T>(
            value: value,
            isExpanded: true,
            underline: const SizedBox(),
            dropdownColor: const Color(0xFF1A1F3A),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
            ),
            icon: const Icon(
              Icons.arrow_drop_down,
              color: Color(0xFF00D9FF),
            ),
            items: items.entries.map((entry) {
              return DropdownMenuItem<T>(
                value: entry.key,
                child: Text(
                  entry.value,
                  overflow: TextOverflow.ellipsis,
                ),
              );
            }).toList(),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
  
  Widget _buildToggleDropdown({
    required String label,
    required bool value,
    required Function(bool) onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF00D9FF).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 10,
            ),
          ),
          DropdownButton<bool>(
            value: value,
            isExpanded: true,
            underline: const SizedBox(),
            dropdownColor: const Color(0xFF1A1F3A),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
            ),
            icon: const Icon(
              Icons.arrow_drop_down,
              color: Color(0xFF00D9FF),
            ),
            items: const [
              DropdownMenuItem(value: false, child: Text('Off')),
              DropdownMenuItem(value: true, child: Text('On')),
            ],
            onChanged: (val) => onChanged(val!),
          ),
        ],
      ),
    );
  }
}
