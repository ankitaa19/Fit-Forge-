const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendWorkoutReminder } = require('./emailService');

class ReminderScheduler {
  constructor() {
    this.job = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Reminder scheduler is already running');
      return;
    }

    // Run every minute to check for pending reminders
    this.job = cron.schedule('* * * * *', async () => {
      await this.checkAndSendReminders();
    });

    this.isRunning = true;
    console.log('✅ Reminder scheduler started (checking every minute)');
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log('🛑 Reminder scheduler stopped');
    }
  }

  async checkAndSendReminders() {
    try {
      // Find all pending reminders that should be sent now
      const reminders = await Reminder.findPendingReminders();

      if (reminders.length === 0) {
        return; // No reminders to send
      }

      console.log(`📧 Found ${reminders.length} reminder(s) to send`);

      // Process each reminder
      for (const reminder of reminders) {
        await this.sendReminder(reminder);
      }
    } catch (error) {
      console.error('❌ Error in reminder scheduler:', error.message);
    }
  }

  async sendReminder(reminder) {
    try {
      console.log(`📤 Sending reminder for: ${reminder.workoutName} to ${reminder.userEmail}`);

      // Send email
      const result = await sendWorkoutReminder(
        reminder.userEmail,
        reminder.workoutName,
        reminder.workoutDetails
      );

      if (result.success) {
        // Mark as sent
        await reminder.markAsSent();
        console.log(`✅ Reminder sent successfully: ${reminder._id}`);
      } else {
        // Mark as failed
        await reminder.markAsFailed(result.message || 'Email service unavailable');
        console.error(`❌ Failed to send reminder: ${reminder._id} - ${result.message}`);
      }
    } catch (error) {
      console.error(`❌ Error sending reminder ${reminder._id}:`, error.message);

      try {
        await reminder.markAsFailed(error.message);
      } catch (updateError) {
        console.error('❌ Failed to update reminder status:', updateError.message);
      }
    }
  }

  // Manual trigger for testing
  async triggerNow() {
    console.log('🔄 Manually triggering reminder check...');
    await this.checkAndSendReminders();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.job ? 'Every minute' : 'Not scheduled',
    };
  }
}

// Export singleton instance
module.exports = new ReminderScheduler();
