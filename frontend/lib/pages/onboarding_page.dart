import 'package:flutter/material.dart';
import 'dashboard_page.dart';
import '../services/progress_service.dart';
import '../utils/responsive.dart';

class OnboardingPage extends StatefulWidget {
  final Map<String, dynamic> user;

  const OnboardingPage({super.key, required this.user});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  int _currentStep = 0;
  String? _selectedFitnessGoal;
  String? _selectedFitnessLevel;
  int _selectedDaysPerWeek = 4;
  int _selectedMinutesPerSession = 30;
  bool _isLoading = false;

  final ProgressService _progressService = ProgressService();

  final List<Map<String, dynamic>> _fitnessGoals = [
    {'name': 'Weight Loss', 'emoji': '🔥'},
    {'name': 'Muscle Gain', 'emoji': '💪'},
    {'name': 'General Fitness', 'emoji': '⚡'},
    {'name': 'Endurance', 'emoji': '🏃'},
    {'name': 'Flexibility & Mobility', 'emoji': '🧘'},
    {'name': 'Core Strength', 'emoji': '💎'},
  ];

  final List<Map<String, dynamic>> _fitnessLevels = [
    {'name': 'Beginner', 'description': 'Just starting out'},
    {'name': 'Intermediate', 'description': 'Some experience'},
    {'name': 'Advanced', 'description': 'Experienced athlete'},
  ];

  Future<void> _completeOnboarding() async {
    if (_selectedFitnessGoal == null || _selectedFitnessLevel == null) {
      _showErrorDialog('Please complete all steps');
      return;
    }

    setState(() => _isLoading = true);

    // Save settings to backend
    if (widget.user['_id'] != null) {
      final response = await _progressService.updateSettings(
        userId: widget.user['_id'],
        fitnessGoal: _selectedFitnessGoal!,
        daysPerWeek: _selectedDaysPerWeek,
        minutesPerSession: _selectedMinutesPerSession,
      );

      if (!response['success']) {
        setState(() => _isLoading = false);
        if (mounted) {
          _showErrorDialog(response['message'] ?? 'Failed to save settings');
        }
        return;
      }
    }

    // Update user profile with onboarding data
    final updatedUser = {
      ...widget.user,
      'fitnessGoal': _selectedFitnessGoal,
      'fitnessLevel': _selectedFitnessLevel,
      'daysPerWeek': _selectedDaysPerWeek,
      'minutesPerSession': _selectedMinutesPerSession,
    };

    setState(() => _isLoading = false);

    // Navigate to dashboard
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => DashboardPage(user: updatedUser)),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (dialogCtx) => Dialog(
        backgroundColor: const Color(0xFF1A1A1A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Container(
          width: Responsive.dialogWidth(dialogCtx, 320),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.red.shade600,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline,
                  size: 40,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Error',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF9E9E9E),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 42,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2A2A2A),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'OK',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _nextStep() {
    if (_currentStep == 0 && _selectedFitnessGoal == null) {
      _showErrorDialog('Please select a fitness goal');
      return;
    }
    if (_currentStep == 1 && _selectedFitnessLevel == null) {
      _showErrorDialog('Please select a fitness level');
      return;
    }

    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
    } else {
      _completeOnboarding();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildStepContent(),
              const SizedBox(height: 48),
              _buildContinueButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildFitnessGoalStep();
      case 1:
        return _buildFitnessLevelStep();
      case 2:
        return _buildWorkoutPreferencesStep();
      default:
        return const SizedBox();
    }
  }

  Widget _buildFitnessGoalStep() {
    return Column(
      children: [
        // Icon
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: const Color(0xFFB4F405).withOpacity(0.2),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Center(
            child: Text('🎯', style: TextStyle(fontSize: 40)),
          ),
        ),
        const SizedBox(height: 32),

        // Title
        const Text(
          'What\'s your fitness goal?',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 48),

        // Goal options grid
        Container(
          constraints: const BoxConstraints(maxWidth: 500),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final count = Responsive.gridCount(
                constraints.maxWidth,
                minTileWidth: 220,
                maxCount: 2,
              );
              final aspect = count == 1 ? 2.2 : 1.5;
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: count,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: aspect,
                ),
                itemCount: _fitnessGoals.length,
                itemBuilder: (context, index) {
                  final goal = _fitnessGoals[index];
                  final isSelected = _selectedFitnessGoal == goal['name'];

                  return InkWell(
                    onTap: () {
                      setState(() {
                        _selectedFitnessGoal = goal['name'];
                      });
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A1A),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? const Color(0xFFB4F405)
                              : const Color(0xFF2A2A2A),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            goal['emoji'],
                            style: const TextStyle(fontSize: 36),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            goal['name'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFitnessLevelStep() {
    return Column(
      children: [
        // Icon
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: const Color(0xFFB4F405).withOpacity(0.2),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Center(child: Text('⚡', style: TextStyle(fontSize: 40))),
        ),
        const SizedBox(height: 32),

        // Title
        const Text(
          'Your fitness level?',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 48),

        // Level options
        Container(
          constraints: const BoxConstraints(maxWidth: 500),
          child: Column(
            children: _fitnessLevels.map((level) {
              final isSelected = _selectedFitnessLevel == level['name'];

              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _selectedFitnessLevel = level['name'];
                    });
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A1A1A),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFFB4F405)
                            : const Color(0xFF2A2A2A),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          level['name'],
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          level['description'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[400],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildWorkoutPreferencesStep() {
    return Column(
      children: [
        // Icon
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: const Color(0xFFB4F405).withOpacity(0.2),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Center(child: Text('⏰', style: TextStyle(fontSize: 40))),
        ),
        const SizedBox(height: 32),

        // Title
        const Text(
          'Workout preferences',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 48),

        Container(
          constraints: const BoxConstraints(maxWidth: 500),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Days per week
              const Text(
                'Days per week',
                style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                alignment: WrapAlignment.center,
                children: [3, 4, 5, 6].map((days) {
                  final isSelected = _selectedDaysPerWeek == days;
                  return InkWell(
                    onTap: () {
                      setState(() {
                        _selectedDaysPerWeek = days;
                      });
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFFB4F405)
                            : const Color(0xFF2A2A2A),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(
                          days.toString(),
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: isSelected
                                ? const Color(0xFF1A1A1A)
                                : Colors.white,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 48),

              // Minutes per session
              const Text(
                'Minutes per session',
                style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                alignment: WrapAlignment.center,
                children: [15, 20, 30, 45].map((minutes) {
                  final isSelected = _selectedMinutesPerSession == minutes;
                  return InkWell(
                    onTap: () {
                      setState(() {
                        _selectedMinutesPerSession = minutes;
                      });
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 16,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFFB4F405)
                            : const Color(0xFF2A2A2A),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${minutes}m',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isSelected
                              ? const Color(0xFF1A1A1A)
                              : Colors.white,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildContinueButton() {
    return ElevatedButton(
      onPressed: _isLoading ? null : _nextStep,
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFFB4F405),
        foregroundColor: const Color(0xFF1A1A1A),
        padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
        disabledBackgroundColor: const Color(0xFFB4F405).withOpacity(0.6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (_isLoading)
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Color(0xFF1A1A1A),
              ),
            )
          else
            Text(
              _currentStep == 2 ? 'Start Training' : 'Continue',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          if (!_isLoading) ...[
            const SizedBox(width: 8),
            const Icon(Icons.arrow_forward, size: 20),
          ],
        ],
      ),
    );
  }
}
