import 'package:flutter/material.dart';
import 'pages/signup_page.dart';

void main() {
  runApp(const FitForgeApp());
}

class FitForgeApp extends StatelessWidget {
  const FitForgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FitForge',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFFB4F405),
        scaffoldBackgroundColor: const Color(0xFF1A1A1A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFB4F405),
          secondary: Color(0xFF2A2A2A), // Changed from pink/purple to dark gray
          surface: Color(0xFF1A1A1A),
          background: Color(0xFF1A1A1A),
          error: Color(0xFFCF6679),
          onPrimary: Colors.black,
          onSecondary: Colors.white,
          onSurface: Colors.white,
          onBackground: Colors.white,
          onError: Colors.black,
        ),
        cardColor: const Color(0xFF1A1A1A),
      ),
      home: const SignUpPage(),
    );
  }
}
