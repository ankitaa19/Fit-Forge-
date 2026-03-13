import 'package:flutter/material.dart';
import '../pages/dashboard_page.dart';
import '../pages/exercises_page.dart';
import '../pages/my_workouts_page.dart';
import '../pages/diet_plan_page.dart';
import '../pages/progress_charts_page.dart';
import '../pages/achievements_page.dart';
import '../pages/bmi_calculator_page.dart';
import '../pages/settings_page.dart';
import '../services/auth_service.dart';
import '../pages/login_page.dart';

class Sidebar extends StatelessWidget {
  final String currentPage;
  final Map<String, dynamic>? user;
  final VoidCallback? onItemSelected;

  const Sidebar({
    super.key,
    required this.currentPage,
    this.user,
    this.onItemSelected,
  });

  static PageRoute<T> _buildNoTransitionRoute<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: Duration.zero,
      reverseTransitionDuration: Duration.zero,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return child;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        border: Border(
          right: BorderSide(color: const Color(0xFF2A2A2A), width: 1),
        ),
      ),
      child: Column(
        children: [
          // Logo Header
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFB4F405),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.fitness_center_rounded,
                    size: 24,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'FitForge',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: Color(0xFF2A2A2A), height: 1),
          const SizedBox(height: 16),

          // Navigation Items
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildNavItem(
                    context,
                    icon: Icons.dashboard_outlined,
                    label: 'Dashboard',
                    isActive: currentPage == 'dashboard',
                    onTap: () {
                      if (currentPage != 'dashboard') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            DashboardPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.fitness_center,
                    label: 'Exercises',
                    isActive: currentPage == 'exercises',
                    onTap: () {
                      if (currentPage != 'exercises') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            ExercisesPage(
                              key: ValueKey(
                                user?['fitnessGoal'] ?? 'exercises',
                              ),
                              user: user,
                            ),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.assignment_outlined,
                    label: 'My Workouts',
                    isActive: currentPage == 'workouts',
                    onTap: () {
                      if (currentPage != 'workouts') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            MyWorkoutsPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.restaurant_menu_outlined,
                    label: 'Diet Plan',
                    isActive: currentPage == 'diet',
                    onTap: () {
                      if (currentPage != 'diet') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            DietPlanPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.trending_up_outlined,
                    label: 'Progress',
                    isActive: currentPage == 'progress',
                    onTap: () {
                      if (currentPage != 'progress') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            ProgressChartsPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.emoji_events_outlined,
                    label: 'Achievements',
                    isActive: currentPage == 'achievements',
                    onTap: () {
                      if (currentPage != 'achievements') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            AchievementsPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.monitor_weight_outlined,
                    label: 'BMI',
                    isActive: currentPage == 'bmi',
                    onTap: () {
                      if (currentPage != 'bmi') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            BMICalculatorPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                  _buildNavItem(
                    context,
                    icon: Icons.settings_outlined,
                    label: 'Settings',
                    isActive: currentPage == 'settings',
                    onTap: () {
                      if (currentPage != 'settings') {
                        Navigator.pushReplacement(
                          context,
                          _buildNoTransitionRoute(
                            SettingsPage(user: user),
                          ),
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),

          // Sign Out
          const Divider(color: Color(0xFF2A2A2A), height: 1),
          _buildNavItem(
            context,
            icon: Icons.logout_outlined,
            label: 'Sign Out',
            isActive: false,
            onTap: () async {
              await AuthService().logout();
              if (context.mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  _buildNoTransitionRoute(const LoginPage()),
                  (route) => false,
                );
              }
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            onItemSelected?.call();
            onTap();
          },
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isActive ? const Color(0xFFB4F405) : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive
                      ? const Color(0xFF1A1A1A)
                      : const Color(0xFF9E9E9E),
                ),
                const SizedBox(width: 12),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    color: isActive
                        ? const Color(0xFF1A1A1A)
                        : const Color(0xFF9E9E9E),
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
