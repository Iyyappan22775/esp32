import 'package:flutter/material.dart';

class EyesSelector extends StatelessWidget {
  final int selectedEye;
  final Function(int) onEyeSelected;

  const EyesSelector({
    Key? key,
    required this.selectedEye,
    required this.onEyeSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F3A),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildTab(1, 'Eyes 1'),
          _buildTab(2, 'Eyes 2'),
          _buildTab(3, 'Eyes 3'),
        ],
      ),
    );
  }
  
  Widget _buildTab(int eyeNumber, String label) {
    final isSelected = selectedEye == eyeNumber;
    
    return Expanded(
      child: GestureDetector(
        onTap: () => onEyeSelected(eyeNumber),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            gradient: isSelected
                ? const LinearGradient(
                    colors: [Color(0xFF00D9FF), Color(0xFF0066FF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  )
                : null,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFF00D9FF).withOpacity(0.5),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey,
              fontSize: 14,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}
