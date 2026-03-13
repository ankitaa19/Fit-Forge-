import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProgressService {
  static const String baseUrl = 'http://localhost:3000/api/progress';

  // Get user progress
  Future<Map<String, dynamic>> getUserProgress(String userId) async {
    try {
      final token = await _getToken();
      print('Token for getUserProgress: $token');
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId';
      print('Fetching progress from: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Progress response status: ${response.statusCode}');
      print('Progress response body: ${response.body}');

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch progress',
        };
      }
    } catch (e) {
      print('Error in getUserProgress: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get goal-specific progress
  Future<Map<String, dynamic>> getGoalProgress(String userId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/goal-progress';
      print('Fetching goal progress from: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Goal progress response status: ${response.statusCode}');
      print('Goal progress response body: ${response.body}');

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch goal progress',
        };
      }
    } catch (e) {
      print('Error in getGoalProgress: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Log a workout session
  Future<Map<String, dynamic>> logWorkout({
    required String userId,
    required int seconds,
    required int exercisesCompleted,
  }) async {
    try {
      final token = await _getToken();
      print('Token for logWorkout: $token');
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/workout';
      final body = {
        'seconds': seconds,
        'exercisesCompleted': exercisesCompleted,
      };
      print('Logging workout to: $url');
      print('Request body: $body');

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      print('Logout workout response status: ${response.statusCode}');
      print('Logout workout response body: ${response.body}');

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Workout logged successfully',
          'data': data['data'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to log workout',
        };
      }
    } catch (e) {
      print('Error in logWorkout: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Update user settings
  Future<Map<String, dynamic>> updateSettings({
    required String userId,
    String? fitnessGoal,
    int? daysPerWeek,
    int? minutesPerSession,
    bool? workoutReminders,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final body = <String, dynamic>{};
      if (fitnessGoal != null) body['fitnessGoal'] = fitnessGoal;
      if (daysPerWeek != null) body['daysPerWeek'] = daysPerWeek;
      if (minutesPerSession != null)
        body['minutesPerSession'] = minutesPerSession;
      if (workoutReminders != null) body['workoutReminders'] = workoutReminders;

      final response = await http.put(
        Uri.parse('$baseUrl/$userId/settings'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Settings updated successfully',
          'data': data['data'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to update settings',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get saved token
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  // Save custom workout
  Future<Map<String, dynamic>> saveCustomWorkout({
    required String userId,
    required String name,
    required List<Map<String, dynamic>> exercises,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/custom-workouts';
      final body = {'name': name, 'exercises': exercises};

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Workout saved successfully',
          'data': data['data'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to save workout',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get custom workouts
  Future<Map<String, dynamic>> getCustomWorkouts(String userId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/custom-workouts';

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch workouts',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Delete custom workout
  Future<Map<String, dynamic>> deleteCustomWorkout({
    required String userId,
    required String workoutId,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/custom-workouts/$workoutId';

      final response = await http.delete(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Workout deleted successfully',
          'data': data['data'],
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to delete workout',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }
}
