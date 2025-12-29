import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'dart:async';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late VideoPlayerController _controller;
  bool _isVideoInitialized = false;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _initializeVideo();
  }

  Future<void> _initializeVideo() async {
    try {
      _controller = VideoPlayerController.asset('assets/splash_video.mp4');
      
      await _controller.initialize();
      
      if (mounted) {
        setState(() {
          _isVideoInitialized = true;
        });
        
        // Set video properties
        _controller.setLooping(false);
        _controller.setVolume(0.0); // Muted
        
        // Play video
        await _controller.play();
        
        // Wait for video to finish
        _controller.addListener(_videoListener);
      }
    } catch (e) {
      print('Error initializing video: $e');
      if (mounted) {
        setState(() {
          _hasError = true;
        });
        // Navigate after 2 seconds if error
        Future.delayed(const Duration(seconds: 2), _navigateToMain);
      }
    }
  }

  void _videoListener() {
    if (_controller.value.position >= _controller.value.duration) {
      _navigateToMain();
    }
  }

  void _navigateToMain() {
    if (mounted) {
      _controller.removeListener(_videoListener);
      Navigator.of(context).pushReplacementNamed('/motion');
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_videoListener);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: _hasError
          ? const Center(
              child: Text(
                'Loading...',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            )
          : _isVideoInitialized
              ? Stack(
                  children: [
                    // Video fills entire screen with contain fit
                    Positioned.fill(
                      child: Center(
                        child: AspectRatio(
                          aspectRatio: _controller.value.aspectRatio,
                          child: VideoPlayer(_controller),
                        ),
                      ),
                    ),
                  ],
                )
              : const Center(
                  child: CircularProgressIndicator(
                    color: Colors.white,
                  ),
                ),
    );
  }
}
