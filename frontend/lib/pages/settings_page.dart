import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../widgets/sidebar.dart';
import '../services/progress_service.dart';
import '../services/reminder_service.dart';
import '../utils/responsive.dart';

class SettingsPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const SettingsPage({super.key, this.user});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  late String selectedGoal;
  late int selectedDaysPerWeek;
  late int selectedMinutesPerSession;
  bool workoutReminders = false;
  bool _isSaving = false;
  List<Map<String, dynamic>> _loadedReminders = [];

  late TextEditingController _nameController;
  final ProgressService _progressService = ProgressService();

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
      text: widget.user?['name'] ?? 'Ankita',
    );

    // Initialize from user preferences
    selectedGoal = widget.user?['fitnessGoal'] as String? ?? 'General Fitness';
    selectedDaysPerWeek = widget.user?['daysPerWeek'] as int? ?? 4;
    selectedMinutesPerSession = widget.user?['minutesPerSession'] as int? ?? 30;
    _loadReminders();
  }

  Future<void> _loadReminders() async {
    final result = await ReminderService().getReminders();
    if (result['success'] == true && mounted) {
      final reminders = (result['reminders'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .where((r) => r['status'] == 'pending')
          .toList();
      setState(() {
        _loadedReminders = reminders;
        workoutReminders = reminders.isNotEmpty;
      });
    }
  }

  Future<void> _saveSettings() async {
    if (widget.user == null || widget.user!['_id'] == null) {
      _showErrorDialog('User not found');
      return;
    }

    setState(() => _isSaving = true);

    try {
      // Call API to save settings
      final response = await _progressService.updateSettings(
        userId: widget.user!['_id'],
        fitnessGoal: selectedGoal,
        daysPerWeek: selectedDaysPerWeek,
        minutesPerSession: selectedMinutesPerSession,
        workoutReminders: workoutReminders,
      );

      if (response['success']) {
        // Update local user object with fresh data from API
        if (widget.user != null && response['data'] != null) {
          final progressData = response['data'];
          widget.user!['fitnessGoal'] = progressData['fitnessGoal'];
          widget.user!['daysPerWeek'] = progressData['daysPerWeek'];
          widget.user!['minutesPerSession'] = progressData['minutesPerSession'];
          widget.user!['name'] = _nameController.text;
        }

        setState(() => _isSaving = false);
        _showSuccessDialog();
      } else {
        setState(() => _isSaving = false);
        _showErrorDialog(response['message'] ?? 'Failed to save settings');
      }
    } catch (e) {
      setState(() => _isSaving = false);
      _showErrorDialog('Error saving settings: ${e.toString()}');
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: const Color(0xFF1A1A1A),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            width: Responsive.dialogWidth(context, 320),
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Success Icon
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: const Color(0xFFB4F405),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    size: 40,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 20),
                // Title
                const Text(
                  'Settings Saved!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                // Message
                Text(
                  'Your preferences have been updated.\nGoal: "$selectedGoal"',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF9E9E9E),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                // OK Button
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFB4F405),
                      foregroundColor: const Color(0xFF1A1A1A),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Got it!',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: const Color(0xFF1A1A1A),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            width: Responsive.dialogWidth(context, 320),
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Error Icon
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
                // Title
                const Text(
                  'Error',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                // Message
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
                // OK Button
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
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
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isNarrow = Responsive.isNarrow(context);
    final pagePadding = Responsive.pagePadding(context);

    final mainContent = SingleChildScrollView(
      padding: pagePadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          const Text(
            'Settings',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Update your fitness preferences',
            style: TextStyle(fontSize: 14, color: Color(0xFF9E9E9E)),
          ),
          const SizedBox(height: 40),

          // Settings Container
          Container(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name
                const Text(
                  'Name',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF2A2A2A),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Fitness Goal
                const Text(
                  'Fitness Goal',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _buildGoalButton('Weight Loss'),
                    _buildGoalButton('Muscle Gain'),
                    _buildGoalButton('General Fitness'),
                    _buildGoalButton('Endurance'),
                    _buildGoalButton('Flexibility & Mobility'),
                    _buildGoalButton('Core Strength'),
                  ],
                ),
                const SizedBox(height: 32),

                // Days per week
                const Text(
                  'Days per week',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _buildNumberButton(3),
                    _buildNumberButton(4),
                    _buildNumberButton(5),
                    _buildNumberButton(6),
                  ],
                ),
                const SizedBox(height: 32),

                // Minutes per session
                const Text(
                  'Minutes per session',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _buildMinutesButton(15),
                    _buildMinutesButton(20),
                    _buildMinutesButton(30),
                    _buildMinutesButton(45),
                  ],
                ),
                const SizedBox(height: 32),

                // Workout Reminders
                GestureDetector(
                  onTap: workoutReminders ? _showRemindersListDialog : null,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A1A1A),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.notifications_none,
                          color: Colors.white,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Workout Reminders',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white,
                                ),
                              ),
                              if (workoutReminders &&
                                  _loadedReminders.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.only(top: 3),
                                  child: Text(
                                    '${_loadedReminders.length} reminder${_loadedReminders.length != 1 ? 's' : ''} active · tap to view',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFFB4F405),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Switch(
                          value: workoutReminders,
                          onChanged: (value) {
                            setState(() {
                              workoutReminders = value;
                            });
                            if (value) {
                              _showReminderSetupModal();
                            }
                          },
                          activeColor: const Color(0xFFB4F405),
                          activeTrackColor: const Color(
                            0xFFB4F405,
                          ).withOpacity(0.5),
                          inactiveThumbColor: const Color(0xFF6E6E6E),
                          inactiveTrackColor: const Color(0xFF3A3A3A),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 40),

                // Save Changes Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: _isSaving ? null : _saveSettings,
                    icon: _isSaving
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Color(0xFF1A1A1A),
                            ),
                          )
                        : const Icon(Icons.save, size: 20),
                    label: Text(
                      _isSaving ? 'Saving...' : 'Save Changes',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFB4F405),
                      foregroundColor: const Color(0xFF1A1A1A),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
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
              title: const Text('Settings'),
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
                  currentPage: 'settings',
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
                Sidebar(currentPage: 'settings', user: widget.user),
                Expanded(child: mainContent),
              ],
            ),
    );
  }

  void _showRemindersListDialog() {
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return Dialog(
            backgroundColor: const Color(0xFF1A1A1A),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Container(
              width: Responsive.dialogWidth(ctx, 360),
              constraints: const BoxConstraints(maxHeight: 520),
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Your Reminders',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(ctx),
                        icon: const Icon(Icons.close, color: Color(0xFF9E9E9E)),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${_loadedReminders.length} active reminder${_loadedReminders.length != 1 ? 's' : ''}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF9E9E9E),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // List
                  _loadedReminders.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.symmetric(vertical: 24),
                          child: Center(
                            child: Text(
                              'No active reminders.\nSet one below!',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Color(0xFF9E9E9E),
                                fontSize: 14,
                                height: 1.6,
                              ),
                            ),
                          ),
                        )
                      : Flexible(
                          child: ListView.separated(
                            shrinkWrap: true,
                            itemCount: _loadedReminders.length,
                            separatorBuilder: (_, __) => const Divider(
                              color: Color(0xFF2A2A2A),
                              height: 1,
                            ),
                            itemBuilder: (_, i) {
                              final r = _loadedReminders[i];
                              final dt = DateTime.parse(
                                r['reminderDateTime'] as String,
                              ).toLocal();
                              final day = DateFormat('EEEE').format(dt);
                              final time = DateFormat('h:mm a').format(dt);
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 38,
                                      height: 38,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF2A2A2A),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.alarm,
                                        color: Color(0xFFB4F405),
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            r['workoutName'] as String? ??
                                                'Workout',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            '$day · $time',
                                            style: const TextStyle(
                                              color: Color(0xFF9E9E9E),
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    IconButton(
                                      onPressed: () async {
                                        final id = r['_id'] as String;
                                        await ReminderService().deleteReminder(
                                          id,
                                        );
                                        await _loadReminders();
                                        setDialogState(() {});
                                        if (_loadedReminders.isEmpty &&
                                            mounted) {
                                          Navigator.pop(ctx);
                                        }
                                      },
                                      icon: const Icon(
                                        Icons.delete_outline,
                                        color: Colors.redAccent,
                                        size: 20,
                                      ),
                                      padding: const EdgeInsets.all(4),
                                      constraints: const BoxConstraints(),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 42,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(ctx);
                        _showReminderSetupModal();
                      },
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text(
                        'Add More',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFB4F405),
                        foregroundColor: const Color(0xFF1A1A1A),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  DateTime _nextWeekday(int weekday, TimeOfDay time) {
    final now = DateTime.now();
    int daysUntil = weekday - now.weekday;
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil == 0) {
      final scheduled = DateTime(
        now.year,
        now.month,
        now.day,
        time.hour,
        time.minute,
      );
      if (scheduled.isAfter(now)) return scheduled;
      daysUntil = 7;
    }
    final target = now.add(Duration(days: daysUntil));
    return DateTime(
      target.year,
      target.month,
      target.day,
      time.hour,
      time.minute,
    );
  }

  void _showReminderSetupModal() {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final selectedDays = List<bool>.filled(7, false);
    TimeOfDay selectedTime = const TimeOfDay(hour: 7, minute: 0);
    final workoutCtrl = TextEditingController(text: 'Workout Reminder');
    bool isLoading = false;
    String? errorMessage;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) {
          return Dialog(
            backgroundColor: const Color(0xFF1A1A1A),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Container(
              width: Responsive.dialogWidth(ctx, 420),
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      const Icon(
                        Icons.alarm,
                        color: Color(0xFFB4F405),
                        size: 26,
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Set Workout Reminder',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.grey),
                        onPressed: () {
                          setState(() => workoutReminders = false);
                          Navigator.pop(ctx);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Choose which days and time to receive your workout reminders.',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF9E9E9E),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Days of week
                  const Text(
                    'Repeat on',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: List.generate(7, (i) {
                      return GestureDetector(
                        onTap: () => setModalState(
                          () => selectedDays[i] = !selectedDays[i],
                        ),
                        child: Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                            color: selectedDays[i]
                                ? const Color(0xFFB4F405)
                                : const Color(0xFF2A2A2A),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            dayLabels[i],
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: selectedDays[i]
                                  ? Colors.black
                                  : Colors.white70,
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 20),

                  // Time picker
                  const Text(
                    'Reminder Time',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: () async {
                      final picked = await showTimePicker(
                        context: ctx,
                        initialTime: selectedTime,
                        builder: (context, child) => Theme(
                          data: ThemeData.dark().copyWith(
                            colorScheme: const ColorScheme.dark(
                              primary: Color(0xFFB4F405),
                              onPrimary: Colors.black,
                              surface: Color(0xFF1A1A1A),
                            ),
                          ),
                          child: child!,
                        ),
                      );
                      if (picked != null)
                        setModalState(() => selectedTime = picked);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2A2A2A),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.access_time,
                            color: Color(0xFFB4F405),
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            selectedTime.format(ctx),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Spacer(),
                          const Icon(
                            Icons.chevron_right,
                            color: Colors.grey,
                            size: 20,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Workout name
                  const Text(
                    'Reminder Label',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: workoutCtrl,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'e.g. Morning Workout',
                      hintStyle: const TextStyle(color: Color(0xFF6E6E6E)),
                      filled: true,
                      fillColor: const Color(0xFF2A2A2A),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                    ),
                  ),

                  if (errorMessage != null) ...[
                    const SizedBox(height: 10),
                    Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red, fontSize: 12),
                    ),
                  ],
                  const SizedBox(height: 24),

                  // Action buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() => workoutReminders = false);
                            Navigator.pop(ctx);
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF3A3A3A)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text(
                            'Cancel',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: isLoading
                              ? null
                              : () async {
                                  if (!selectedDays.any((d) => d)) {
                                    setModalState(
                                      () => errorMessage =
                                          'Please select at least one day',
                                    );
                                    return;
                                  }
                                  if (workoutCtrl.text.trim().isEmpty) {
                                    setModalState(
                                      () => errorMessage =
                                          'Please enter a reminder label',
                                    );
                                    return;
                                  }
                                  setModalState(() {
                                    isLoading = true;
                                    errorMessage = null;
                                  });
                                  final service = ReminderService();
                                  final userEmail =
                                      widget.user?['email'] as String? ?? '';
                                  int successCount = 0;
                                  for (int i = 0; i < 7; i++) {
                                    if (selectedDays[i]) {
                                      final dt = _nextWeekday(
                                        i + 1,
                                        selectedTime,
                                      );
                                      final result = await service
                                          .createReminder(
                                            userEmail: userEmail,
                                            workoutName: workoutCtrl.text
                                                .trim(),
                                            reminderDateTime: dt,
                                          );
                                      if (result['success'] == true)
                                        successCount++;
                                    }
                                  }
                                  setModalState(() => isLoading = false);
                                  if (mounted) Navigator.pop(ctx);
                                  if (successCount > 0) {
                                    showDialog(
                                      context: context,
                                      builder: (_) => Dialog(
                                        backgroundColor: const Color(
                                          0xFF1A1A1A,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            16,
                                          ),
                                        ),
                                        child: Container(
                                          width: Responsive.dialogWidth(
                                            context,
                                            320,
                                          ),
                                          padding: const EdgeInsets.all(24),
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Container(
                                                width: 60,
                                                height: 60,
                                                decoration: const BoxDecoration(
                                                  color: Color(0xFFB4F405),
                                                  shape: BoxShape.circle,
                                                ),
                                                child: const Icon(
                                                  Icons.alarm_on_rounded,
                                                  size: 36,
                                                  color: Color(0xFF1A1A1A),
                                                ),
                                              ),
                                              const SizedBox(height: 20),
                                              const Text(
                                                'Reminders Set!',
                                                style: TextStyle(
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.white,
                                                ),
                                              ),
                                              const SizedBox(height: 10),
                                              Text(
                                                '$successCount workout reminder${successCount > 1 ? 's have' : ' has'} been scheduled.\nWe\'ll email you before each session!',
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
                                                  onPressed: () {
                                                    Navigator.of(context).pop();
                                                    _loadReminders();
                                                  },
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFFB4F405),
                                                    foregroundColor:
                                                        const Color(0xFF1A1A1A),
                                                    elevation: 0,
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            8,
                                                          ),
                                                    ),
                                                  ),
                                                  child: const Text(
                                                    'Got it!',
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  } else {
                                    setState(() => workoutReminders = false);
                                    showDialog(
                                      context: context,
                                      builder: (_) => Dialog(
                                        backgroundColor: const Color(
                                          0xFF1A1A1A,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            16,
                                          ),
                                        ),
                                        child: Container(
                                          width: Responsive.dialogWidth(
                                            context,
                                            320,
                                          ),
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
                                                  Icons.alarm_off_rounded,
                                                  size: 36,
                                                  color: Colors.white,
                                                ),
                                              ),
                                              const SizedBox(height: 20),
                                              const Text(
                                                'Could Not Set Reminder',
                                                style: TextStyle(
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.white,
                                                ),
                                              ),
                                              const SizedBox(height: 10),
                                              const Text(
                                                'Failed to schedule reminders.\nPlease try again.',
                                                textAlign: TextAlign.center,
                                                style: TextStyle(
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
                                                  onPressed: () => Navigator.of(
                                                    context,
                                                  ).pop(),
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFF2A2A2A),
                                                    foregroundColor:
                                                        Colors.white,
                                                    elevation: 0,
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            8,
                                                          ),
                                                    ),
                                                  ),
                                                  child: const Text(
                                                    'OK',
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  }
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFB4F405),
                            foregroundColor: Colors.black,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.black,
                                  ),
                                )
                              : const Text(
                                  'Set Reminder',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildGoalButton(String goal) {
    final isSelected = selectedGoal == goal;
    return InkWell(
      onTap: () {
        setState(() {
          selectedGoal = goal;
        });
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFB4F405) : const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          goal,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: isSelected ? const Color(0xFF1A1A1A) : Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildNumberButton(int number) {
    final isSelected = selectedDaysPerWeek == number;
    return InkWell(
      onTap: () {
        setState(() {
          selectedDaysPerWeek = number;
        });
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFB4F405) : const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Text(
            number.toString(),
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: isSelected ? const Color(0xFF1A1A1A) : Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMinutesButton(int minutes) {
    final isSelected = selectedMinutesPerSession == minutes;
    return InkWell(
      onTap: () {
        setState(() {
          selectedMinutesPerSession = minutes;
        });
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFB4F405) : const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          '${minutes}m',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: isSelected ? const Color(0xFF1A1A1A) : Colors.white,
          ),
        ),
      ),
    );
  }
}
