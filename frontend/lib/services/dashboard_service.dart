import 'dart:convert';
import 'package:http/http.dart' as http;

class DashboardService {
  static const String baseUrl = 'http://localhost:3000/api';

  // Get dashboard videos
  Future<Map<String, dynamic>> getDashboardVideos() async {
    try {
      final uri = Uri.parse('$baseUrl/dashboard');

      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'videos': data['data'] ?? []};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch dashboard videos',
          'videos': [],
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
        'videos': [],
      };
    }
  }
}
