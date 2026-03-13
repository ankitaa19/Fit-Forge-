import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ReminderService {
  static const String baseUrl = 'http://localhost:3000/api';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Create a new reminder
  Future<Map<String, dynamic>> createReminder({
    required String userEmail,
    required String workoutName,
    required DateTime reminderDateTime,
    String? workoutDetails,
  }) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/reminders'),
        headers: headers,
        body: jsonEncode({
          'userEmail': userEmail,
          'workoutName': workoutName,
          'reminderDateTime': reminderDateTime.toIso8601String(),
          if (workoutDetails != null) 'workoutDetails': workoutDetails,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return {
          'success': true,
          'message': data['message'],
          'reminder': data['reminder'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to create reminder',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Error creating reminder: $e'};
    }
  }

  // Get all reminders for the logged-in user
  Future<Map<String, dynamic>> getReminders() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/reminders'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'reminders': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch reminders',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Error fetching reminders: $e'};
    }
  }

  // Get a single reminder by ID
  Future<Map<String, dynamic>> getReminder(String reminderId) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/reminders/$reminderId'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'reminder': data['reminder']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch reminder',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Error fetching reminder: $e'};
    }
  }

  // Update a pending reminder
  Future<Map<String, dynamic>> updateReminder({
    required String reminderId,
    String? workoutName,
    DateTime? reminderDateTime,
    String? workoutDetails,
  }) async {
    try {
      final headers = await _getHeaders();
      final body = <String, dynamic>{};

      if (workoutName != null) body['workoutName'] = workoutName;
      if (reminderDateTime != null) {
        body['reminderDateTime'] = reminderDateTime.toIso8601String();
      }
      if (workoutDetails != null) body['workoutDetails'] = workoutDetails;

      final response = await http.put(
        Uri.parse('$baseUrl/reminders/$reminderId'),
        headers: headers,
        body: jsonEncode(body),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'],
          'reminder': data['reminder'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update reminder',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Error updating reminder: $e'};
    }
  }

  // Delete a reminder
  Future<Map<String, dynamic>> deleteReminder(String reminderId) async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/reminders/$reminderId'),
        headers: headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'message': data['message']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to delete reminder',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Error deleting reminder: $e'};
    }
  }

  // Helper method to get pending reminders
  List<Map<String, dynamic>> getPendingReminders(List<dynamic> reminders) {
    return reminders
        .where((reminder) => reminder['status'] == 'pending')
        .cast<Map<String, dynamic>>()
        .toList();
  }

  // Helper method to get sent reminders
  List<Map<String, dynamic>> getSentReminders(List<dynamic> reminders) {
    return reminders
        .where((reminder) => reminder['status'] == 'sent')
        .cast<Map<String, dynamic>>()
        .toList();
  }

  // Helper method to sort reminders by date
  List<Map<String, dynamic>> sortRemindersByDate(
    List<dynamic> reminders, {
    bool ascending = true,
  }) {
    final reminderList = reminders.cast<Map<String, dynamic>>().toList();
    reminderList.sort((a, b) {
      final dateA = DateTime.parse(a['reminderDateTime']);
      final dateB = DateTime.parse(b['reminderDateTime']);
      return ascending ? dateA.compareTo(dateB) : dateB.compareTo(dateA);
    });
    return reminderList;
  }
}
