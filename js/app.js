// Main App Controller
const App = {
    currentView: 'dashboard',

    init() {
        // Set up navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.navigate(view);
            });
        });

        // Menu functionality
        document.getElementById('menuBtn').addEventListener('click', () => {
            document.getElementById('menuOverlay').style.display = 'flex';
        });

        document.getElementById('closeMenuBtn').addEventListener('click', () => {
            document.getElementById('menuOverlay').style.display = 'none';
        });

        document.getElementById('menuOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'menuOverlay') {
                document.getElementById('menuOverlay').style.display = 'none';
            }
        });

        document.getElementById('defaultRestTime').addEventListener('change', (e) => {
            const settings = DataManager.getSettings();
            settings.defaultRestTime = parseInt(e.target.value);
            DataManager.saveSettings(settings);
        });

        document.getElementById('resetDataBtn').addEventListener('click', () => {
            DataManager.resetAllData();
        });

        // Load saved settings
        const settings = DataManager.getSettings();
        document.getElementById('defaultRestTime').value = settings.defaultRestTime;

        // Navigate to initial view
        this.navigate('dashboard');

        // Check for today's scheduled workout
        this.checkTodayWorkout();
    },

    navigate(view, updateNav = true) {
        this.currentView = view;

        // Update navigation
        if (updateNav) {
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-view') === view) {
                    btn.classList.add('active');
                }
            });
        }

        // Reset header
        document.getElementById('backBtn').style.display = 'none';

        // Show bottom nav (might be hidden during workout)
        if (view !== 'workout') {
            document.getElementById('bottomNav').style.display = 'flex';
        }

        // Render view
        let content = '';
        let title = '';

        switch (view) {
            case 'dashboard':
                content = this.renderDashboard();
                title = 'Dashboard';
                break;
            case 'exercises':
                content = ExercisesView.render();
                title = 'Exercises';
                break;
            case 'routines':
                content = RoutinesView.render();
                title = 'Routines';
                break;
            case 'calendar':
                content = CalendarView.render();
                title = 'Calendar';
                break;
            case 'history':
                content = HistoryView.render();
                title = 'History';
                break;
            case 'workout':
                content = WorkoutView.render();
                title = 'Workout';
                break;
            default:
                content = this.renderDashboard();
                title = 'Dashboard';
        }

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = title;

        // Scroll to top
        document.getElementById('mainContent').scrollTop = 0;
    },

    renderDashboard() {
        const todayStr = Utils.formatDate(new Date());
        const todayWorkout = DataManager.getWorkoutForDate(todayStr);
        const history = DataManager.getWorkoutHistory();
        const recentWorkout = history.length > 0 ? history[0] : null;

        return `
            <div class="dashboard-view">
                <div class="card">
                    <h2>Welcome! 💪</h2>
                    <p style="color: var(--text-light);">Your ankle strengthening companion</p>
                </div>

                ${this.renderTodayWorkout(todayWorkout)}
                ${this.renderQuickStats(history)}
                ${this.renderRecentWorkout(recentWorkout)}
                ${this.renderQuickActions()}
            </div>
        `;
    },

    renderTodayWorkout(workout) {
        if (!workout) {
            return `
                <div class="card">
                    <h3>Today's Workout</h3>
                    <p style="color: var(--text-light); margin: 1rem 0;">No workout scheduled for today</p>
                    <button class="btn btn-outline" onclick="App.navigate('calendar')">
                        Schedule a Workout
                    </button>
                </div>
            `;
        }

        const exerciseCount = workout.exercises ? workout.exercises.length : 0;

        return `
            <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white;">
                <h3 style="color: white;">Today's Workout</h3>
                <div style="font-size: 1.3rem; font-weight: 600; margin: 1rem 0;">
                    ${workout.name}
                </div>
                <div style="opacity: 0.9; margin-bottom: 1rem;">
                    ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}
                </div>
                <button class="btn btn-success" onclick="WorkoutView.startWorkout('${workout.id}')">
                    ▶️ Start Now
                </button>
                <button class="btn btn-outline" style="margin-top: 0.5rem; color: white; border-color: white;" onclick="RoutinesView.showRoutineDetail('${workout.id}')">
                    View Details
                </button>
            </div>
        `;
    },

    renderQuickStats(history) {
        const totalWorkouts = history.length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentWorkouts = history.filter(log =>
            new Date(log.startTime) >= sevenDaysAgo
        ).length;

        return `
            <div class="card">
                <h3>Quick Stats</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: var(--bg); border-radius: 6px;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${totalWorkouts}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">Total Workouts</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--bg); border-radius: 6px;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--success);">${recentWorkouts}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">This Week</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderRecentWorkout(workout) {
        if (!workout) return '';

        const date = new Date(workout.startTime);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
            <div class="card">
                <h3>Last Workout</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <div>
                        <div style="font-weight: 600;">${workout.routineName}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">${dateStr}</div>
                    </div>
                    <div style="font-size: 1.2rem; font-weight: 600; color: var(--primary);">
                        ${Utils.formatDuration(workout.duration)}
                    </div>
                </div>
            </div>
        `;
    },

    renderQuickActions() {
        const routines = DataManager.getRoutines();
        const exercises = DataManager.getExercises();

        return `
            <div class="card">
                <h3>Quick Actions</h3>
                ${routines.length === 0 ? `
                    <p style="color: var(--text-light); margin: 1rem 0;">Create your first routine to get started</p>
                    <button class="btn" onclick="App.navigate('routines')">
                        Create Routine
                    </button>
                ` : `
                    <button class="btn" onclick="App.navigate('routines')">
                        View Routines (${routines.length})
                    </button>
                `}
                <button class="btn btn-outline" onclick="App.navigate('exercises')">
                    Browse Exercises (${exercises.length})
                </button>
            </div>
        `;
    },

    checkTodayWorkout() {
        const todayStr = Utils.formatDate(new Date());
        const todayWorkout = DataManager.getWorkoutForDate(todayStr);
        const history = DataManager.getWorkoutHistory();

        if (todayWorkout) {
            // Check if already completed today
            const completedToday = history.some(log => {
                const logDate = Utils.formatDate(new Date(log.startTime));
                return logDate === todayStr && log.routineId === todayWorkout.id;
            });

            if (!completedToday) {
                // Show reminder
                setTimeout(() => {
                    if (confirm(`You have "${todayWorkout.name}" scheduled for today. Start now?`)) {
                        WorkoutView.startWorkout(todayWorkout.id);
                    }
                }, 1000);
            }
        }
    }
};

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
