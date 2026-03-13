import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class DietService {
  static const String baseUrl = 'http://localhost:3000/api/diet-cyclical';

  // Get diet plan for a specific date (cyclical 31-day system)
  Future<Map<String, dynamic>> getDietPlan(
    String userId, {
    String? date,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final dateParam = date ?? DateTime.now().toIso8601String().split('T')[0];
      final url = '$baseUrl/$userId?date=$dateParam';
      print('Fetching diet plan from: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Diet plan response status: ${response.statusCode}');
      print('Diet plan response body: ${response.body}');

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch diet plan',
        };
      }
    } catch (e) {
      print('Error in getDietPlan: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get diet plans for entire month (for calendar view)
  Future<Map<String, dynamic>> getDietPlanMonth(
    String userId, {
    required int year,
    required int month,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return {'success': false, 'message': 'No authentication token'};
      }

      final url = '$baseUrl/$userId/month/$year/$month';
      print('Fetching monthly diet plans from: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Monthly diet plan response status: ${response.statusCode}');

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch monthly diet plans',
        };
      }
    } catch (e) {
      print('Error in getDietPlanMonth: $e');
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get saved token
  Future<String?> _getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(
        'auth_token',
      ); // Fixed: Changed from 'token' to 'auth_token' to match AuthService
    } catch (e) {
      print('Error getting token: $e');
      return null;
    }
  }
}
