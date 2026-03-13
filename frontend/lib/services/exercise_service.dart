import 'dart:convert';
import 'package:http/http.dart' as http;

class ExerciseService {
  static const String baseUrl = 'http://localhost:3000/api';

  // Get exercises by fitness goal
  Future<Map<String, dynamic>> getExercisesByGoal(
    String fitnessGoal, {
    String? level,
  }) async {
    try {
      // Map fitness goal to API endpoint
      String? endpoint;
      switch (fitnessGoal) {
        case 'Weight Loss':
          endpoint = 'weightloss';
          break;
        case 'Muscle Gain':
          endpoint = 'musclegain';
          break;
        case 'Core Strength':
          endpoint = 'corestrength';
          break;
        case 'Flexibility & Mobility':
          endpoint = 'flexibilitymobility';
          break;
        case 'Endurance':
          endpoint = 'endurance';
          break;
        case 'General Fitness':
          endpoint = 'generalfitness';
          break;
        default:
          // Return empty result for unsupported goals
          return {
            'success': true,
            'exercises': [],
            'count': 0,
            'message': 'Exercises for $fitnessGoal coming soon!',
            'unsupported': true,
          };
      }

      // Build query parameters
      Map<String, String> queryParams = {};
      if (level != null) queryParams['level'] = level;

      final uri = Uri.parse(
        '$baseUrl/$endpoint',
      ).replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'exercises': data['data'] ?? [],
          'count': data['count'] ?? 0,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to fetch exercises',
          'exercises': [],
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
        'exercises': [],
      };
    }
  }

  // Get single exercise by ID and fitness goal
  Future<Map<String, dynamic>> getExerciseById(
    String id,
    String fitnessGoal,
  ) async {
    try {
      // Map fitness goal to API endpoint
      String? endpoint;
      switch (fitnessGoal) {
        case 'Weight Loss':
          endpoint = 'weightloss';
          break;
        case 'Muscle Gain':
          endpoint = 'musclegain';
          break;
        case 'Core Strength':
          endpoint = 'corestrength';
          break;
        case 'Flexibility & Mobility':
          endpoint = 'flexibilitymobility';
          break;
        case 'Endurance':
          endpoint = 'endurance';
          break;
        case 'General Fitness':
          endpoint = 'generalfitness';
          break;
        default:
          return {
            'success': false,
            'message': 'Exercises for $fitnessGoal are not available yet',
          };
      }

      final response = await http.get(
        Uri.parse('$baseUrl/$endpoint/$id'),
        headers: {'Content-Type': 'application/json'},
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'exercise': data['data']};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Exercise not found',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }
}
