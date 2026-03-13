import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../services/diet_service.dart';
import 'package:intl/intl.dart';
import '../utils/responsive.dart';

class DietPlanPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const DietPlanPage({super.key, this.user});

  @override
  State<DietPlanPage> createState() => _DietPlanPageState();
}

class _DietPlanPageState extends State<DietPlanPage> {
  final DietService _dietService = DietService();
  DateTime _selectedDate = DateTime.now();
  DateTime _currentMonth = DateTime.now();
  bool _isLoading = true;
  Map<String, dynamic>? _dietPlan;
  String _fitnessGoal = 'General Fitness';

  @override
  void initState() {
    super.initState();
    _loadDietPlan();
  }

  Future<void> _loadDietPlan() async {
    if (widget.user == null || widget.user!['_id'] == null) {
      print('❌ No user found');
      setState(() => _isLoading = false);
      return;
    }

    setState(() => _isLoading = true);

    final dateString = DateFormat('yyyy-MM-dd').format(_selectedDate);
    print('📅 Loading diet plan for: $dateString');

    final response = await _dietService.getDietPlan(
      widget.user!['_id'],
      date: dateString,
    );

    print('📋 Diet API response: $response');

    if (mounted) {
      setState(() {
        if (response['success'] == true) {
          _dietPlan = response['data'];
          _fitnessGoal = _dietPlan?['fitnessGoal'] ?? 'General Fitness';
          print('✅ Diet plan loaded successfully');
          print('🎯 Fitness Goal: $_fitnessGoal');
          print('🍽️ Meals: ${_dietPlan?['meals']}');
        } else {
          print('❌ Failed to load diet plan: ${response['message']}');
        }
        _isLoading = false;
      });
    }
  }

  void _selectDate(DateTime date) {
    setState(() {
      _selectedDate = date;
    });
    _loadDietPlan();
  }

  void _changeMonth(int months) {
    setState(() {
      _currentMonth = DateTime(
        _currentMonth.year,
        _currentMonth.month + months,
        1,
      );
    });
  }

  void _goToToday() {
    setState(() {
      _selectedDate = DateTime.now();
      _currentMonth = DateTime.now();
    });
    _loadDietPlan();
  }

  @override
  Widget build(BuildContext context) {
    final isNarrow = Responsive.isNarrow(context);
    final isMobile = Responsive.isMobile(context);
    final pagePadding = Responsive.pagePadding(context);

    final header = isMobile
        ? Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Monthly Diet Plan',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '31-Day Cyclical Nutrition Plan for $_fitnessGoal',
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF9E9E9E),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _goToToday,
                  icon: const Icon(Icons.today, size: 20),
                  label: const Text('Today\'s Plan'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFB4F405),
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 16,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Monthly Diet Plan',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '31-Day Cyclical Nutrition Plan for $_fitnessGoal',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF9E9E9E),
                    ),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: _goToToday,
                icon: const Icon(Icons.today, size: 20),
                label: const Text('Today\'s Plan'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFB4F405),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 16,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          );

    final mainContent = _isLoading
        ? const Center(
            child: CircularProgressIndicator(color: Color(0xFFB4F405)),
          )
        : Padding(
            padding: pagePadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                header,
                SizedBox(height: isMobile ? 20 : 32),

                // Calendar + Diet Plan
                Expanded(
                  child: isNarrow
                      ? SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildCalendar(),
                              const SizedBox(height: 24),
                              _dietPlan != null
                                  ? _buildDietPlanDetails(isMobile)
                                  : _buildEmptyState(),
                            ],
                          ),
                        )
                      : Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Calendar - 35% width
                            Expanded(
                              flex: 35,
                              child: SingleChildScrollView(
                                child: _buildCalendar(),
                              ),
                            ),
                            const SizedBox(width: 24),

                            // Diet Plan Content - 65% width
                            Expanded(
                              flex: 65,
                              child: SingleChildScrollView(
                                child: _dietPlan != null
                                    ? _buildDietPlanDetails(isMobile)
                                    : _buildEmptyState(),
                              ),
                            ),
                          ],
                        ),
                ),
              ],
            ),
          );

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      appBar: isNarrow
          ? AppBar(
              title: const Text('Diet Plan'),
              backgroundColor: const Color(0xFF0F0F0F),
              elevation: 0,
              iconTheme: const IconThemeData(color: Colors.white),
              titleTextStyle: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            )
          : null,
      drawer: isNarrow
          ? Drawer(
              child: SafeArea(
                child: Sidebar(
                  currentPage: 'diet',
                  user: widget.user,
                  onItemSelected: () => Navigator.of(context).pop(),
                ),
              ),
            )
          : null,
      body: isNarrow
          ? mainContent
          : Row(
              children: [
                Sidebar(currentPage: 'diet', user: widget.user),
                Expanded(child: mainContent),
              ],
            ),
    );
  }

  Widget _buildCalendar() {
    final isMobile = Responsive.isMobile(context);
    final daysInMonth = DateTime(
      _currentMonth.year,
      _currentMonth.month + 1,
      0,
    ).day;

    final firstDayOfMonth = DateTime(
      _currentMonth.year,
      _currentMonth.month,
      1,
    );

    final firstWeekday =
        firstDayOfMonth.weekday % 7; // 0 = Sunday, 6 = Saturday

    return Container(
      padding: EdgeInsets.all(isMobile ? 16 : 24),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        children: [
          // Month Header with Navigation
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: () => _changeMonth(-1),
                icon: const Icon(Icons.chevron_left),
                color: Colors.white,
                iconSize: 28,
              ),
              Text(
                DateFormat('MMMM yyyy').format(_currentMonth),
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              IconButton(
                onPressed: () => _changeMonth(1),
                icon: const Icon(Icons.chevron_right),
                color: Colors.white,
                iconSize: 28,
              ),
            ],
          ),
          SizedBox(height: isMobile ? 16 : 24),

          // Weekday Headers
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                .map(
                  (day) => Expanded(
                    child: Text(
                      day,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF9E9E9E),
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
          SizedBox(height: isMobile ? 12 : 16),

          // Calendar Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              childAspectRatio: 1,
              crossAxisSpacing: isMobile ? 4 : 8,
              mainAxisSpacing: isMobile ? 4 : 8,
            ),
            itemCount: firstWeekday + daysInMonth,
            itemBuilder: (context, index) {
              if (index < firstWeekday) {
                return const SizedBox.shrink(); // Empty space before month starts
              }

              final day = index - firstWeekday + 1;
              final date = DateTime(
                _currentMonth.year,
                _currentMonth.month,
                day,
              );
              final isSelected =
                  DateFormat('yyyy-MM-dd').format(date) ==
                  DateFormat('yyyy-MM-dd').format(_selectedDate);
              final isToday =
                  DateFormat('yyyy-MM-dd').format(date) ==
                  DateFormat('yyyy-MM-dd').format(DateTime.now());

              return InkWell(
                onTap: () => _selectDate(date),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFFB4F405)
                        : isToday
                        ? const Color(0xFF2A2A2A)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: isToday && !isSelected
                        ? Border.all(color: const Color(0xFFB4F405), width: 2)
                        : null,
                  ),
                  child: Center(
                    child: Text(
                      day.toString(),
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: isSelected || isToday
                            ? FontWeight.w600
                            : FontWeight.normal,
                        color: isSelected
                            ? Colors.black
                            : isToday
                            ? const Color(0xFFB4F405)
                            : Colors.white,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
      ],
    ),
  );
}

  Widget _buildDietPlanDetails(bool isMobile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Simple Date Header (like reference image)
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A1A),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.apple,
                color: Color(0xFFB4F405),
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                DateFormat('EEEE, MMMM d').format(_selectedDate),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Breakfast and Lunch
        isMobile
            ? Column(
                children: [
                  _buildSimpleMealCard('🍞', 'Breakfast', 'breakfast'),
                  const SizedBox(height: 16),
                  _buildSimpleMealCard('☀️', 'Lunch', 'lunch'),
                ],
              )
            : IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      child: _buildSimpleMealCard(
                        '🍞',
                        'Breakfast',
                        'breakfast',
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildSimpleMealCard('☀️', 'Lunch', 'lunch'),
                    ),
                  ],
                ),
              ),
        const SizedBox(height: 16),

        // Dinner and Snacks
        isMobile
            ? Column(
                children: [
                  _buildSimpleMealCard('🌙', 'Dinner', 'dinner'),
                  const SizedBox(height: 16),
                  _buildSnacksCard(),
                ],
              )
            : IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      child: _buildSimpleMealCard('🌙', 'Dinner', 'dinner'),
                    ),
                    const SizedBox(width: 16),
                    Expanded(child: _buildSnacksCard()),
                  ],
                ),
              ),
        const SizedBox(height: 24),

        // Hydration and Tip
        isMobile
            ? Column(
                children: [
                  _buildHydrationCard(),
                  const SizedBox(height: 16),
                  _buildTipCard(),
                ],
              )
            : IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(child: _buildHydrationCard()),
                    const SizedBox(width: 16),
                    Expanded(child: _buildTipCard()),
                  ],
                ),
              ),
      ],
    );
  }

  // Simplified meal card matching reference image
  Widget _buildSimpleMealCard(String emoji, String title, String mealKey) {
    final meals = _dietPlan!['meals'] as Map<String, dynamic>;
    final meal = meals[mealKey] as Map<String, dynamic>?;

    if (meal == null) return const SizedBox.shrink();

    return Container(
      constraints: const BoxConstraints(minHeight: 140),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            meal['name'] ?? '',
            style: const TextStyle(
              fontSize: 15,
              color: Color(0xFFB4F405),
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${meal['calories']} kcal • ${meal['protein']}g protein • ${meal['carbs']}g carbs • ${meal['fat']}g fat',
            style: const TextStyle(fontSize: 13, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }

  // Combined snacks card
  Widget _buildSnacksCard() {
    final meals = _dietPlan!['meals'] as Map<String, dynamic>;
    final midMorning = meals['midMorningSnack'] as Map<String, dynamic>?;
    final evening = meals['eveningSnack'] as Map<String, dynamic>?;

    return Container(
      constraints: const BoxConstraints(minHeight: 140),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              const Text('🍪', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              const Text(
                'Snacks',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          if (midMorning != null) ...[
            const SizedBox(height: 12),
            Text(
              'Mid-Morning: ${midMorning['name']}',
              style: const TextStyle(
                fontSize: 15,
                color: Color(0xFFB4F405),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${midMorning['calories']} kcal • ${midMorning['protein']}g protein',
              style: const TextStyle(fontSize: 13, color: Color(0xFF9E9E9E)),
            ),
          ],
          if (evening != null) ...[
            const SizedBox(height: 12),
            Text(
              'Evening: ${evening['name']}',
              style: const TextStyle(
                fontSize: 15,
                color: Color(0xFFB4F405),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${evening['calories']} kcal • ${evening['protein']}g protein',
              style: const TextStyle(fontSize: 13, color: Color(0xFF9E9E9E)),
            ),
          ],
        ],
      ),
    );
  }

  // Simplified hydration card
  Widget _buildHydrationCard() {
    final tips = _dietPlan!['tips'] as Map<String, dynamic>;
    final hydrationTip =
        tips['hydration'] ?? 'Stay hydrated throughout the day';

    return Container(
      constraints: const BoxConstraints(minHeight: 140),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF4FC3F7).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.water_drop,
                  color: Color(0xFF4FC3F7),
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Hydration',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            hydrationTip,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF9E9E9E),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  // Simplified tip card
  Widget _buildTipCard() {
    final tips = _dietPlan!['tips'] as Map<String, dynamic>;
    final nutritionTip = tips['nutrition'] ?? 'Maintain a balanced diet';

    return Container(
      constraints: const BoxConstraints(minHeight: 140),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFB4F405).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.lightbulb,
                  color: Color(0xFFB4F405),
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Tip',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            nutritionTip,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF9E9E9E),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF2A2A2A),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.restaurant_menu,
                size: 64,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No diet plan available',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Complete your onboarding to get personalized meal plans',
              style: TextStyle(fontSize: 14, color: Colors.grey[400]),
            ),
          ],
        ),
      ),
    );
  }
}
