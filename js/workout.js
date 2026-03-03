// Active Workout View
const WorkoutView = {
    currentWorkout: null,
    currentExerciseIndex: 0,
    currentSet: 1,
    timerInterval: null,
    timerSeconds: 0,
    isResting: false,
    startTime: null,

    startWorkout(routineId) {
        const routine = DataManager.getRoutine(routineId);
        if (!routine || !routine.exercises || routine.exercises.length === 0) {
            alert('This routine has no exercises');
            return;
        }

        // Validate all exercises exist
        const allExercises = DataManager.getExercises();
        const missingExercises = routine.exercises.filter(ex => {
            return !allExercises.find(e => e.id === ex.exerciseId);
        });

        if (missingExercises.length > 0) {
            alert('This routine contains deleted exercises. Please edit the routine to remove them.');
            return;
        }

        this.currentWorkout = {
            routineId: routine.id,
            routineName: routine.name,
            exercises: routine.exercises.map(ex => ({
                ...ex,
                completedSets: []
            }))
        };
        this.currentExerciseIndex = 0;
        this.currentSet = 1;
        this.startTime = new Date();

        console.log('Starting workout with routine:', routine);
        console.log('Current workout object:', this.currentWorkout);

        App.navigate('workout', false);
    },

    // Helper method to update the display during workout
    updateDisplay() {
        const content = this.render();
        if (content) {
            document.getElementById('mainContent').innerHTML = content;
            document.getElementById('pageTitle').textContent = 'Workout';
        }
    },

    render() {
        if (!this.currentWorkout) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">🏋️</div>
                    <div class="empty-state-text">No active workout</div>
                    <p style="color: var(--text-light);">Start a workout from a routine</p>
                </div>
            `;
        }

        const currentExercise = this.currentWorkout.exercises[this.currentExerciseIndex];

        // Debug: Check if currentExercise exists and has valid data
        if (!currentExercise) {
            alert('Error: No exercise data found at current index.');
            this.quitWorkout();
            return '';
        }

        if (!currentExercise.exerciseId) {
            alert(`Error: Exercise has no ID. Exercise data: ${JSON.stringify(currentExercise)}`);
            this.nextExercise();
            return '';
        }

        const exerciseData = DataManager.getExercise(currentExercise.exerciseId);

        // Debug logging
        console.log('Current Exercise:', currentExercise);
        console.log('Exercise Data:', exerciseData);

        // Handle missing exercise (deleted after routine was created)
        if (!exerciseData) {
            alert(`Exercise not found (ID: ${currentExercise.exerciseId}). It may have been deleted. Skipping to next exercise.`);
            this.nextExercise();
            return '';
        }

        // Ensure sets and reps have values
        const sets = currentExercise.sets || exerciseData.sets || '3';
        const reps = currentExercise.reps || exerciseData.reps || '10';

        const progress = ((this.currentExerciseIndex + 1) / this.currentWorkout.exercises.length) * 100;

        const content = `
            <div class="workout-view">
                <div class="card">
                    <div class="card-subtitle">${this.currentWorkout.routineName || 'Workout'}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="text-center mt-1">
                        Exercise ${this.currentExerciseIndex + 1} of ${this.currentWorkout.exercises.length}
                    </div>
                </div>

                <div class="card">
                    <h2>${exerciseData.name || 'Unknown Exercise'}</h2>
                    <div class="card-meta mb-1">
                        <span><strong>Target:</strong> ${sets} sets × ${reps} reps</span>
                    </div>
                    <div class="card-description">
                        ${exerciseData.description || 'No description'}
                    </div>
                    ${exerciseData.videoUrl ? `
                        <a href="${exerciseData.videoUrl}" target="_blank" class="btn btn-outline btn-small">
                            📹 Watch Video
                        </a>
                    ` : ''}
                </div>

                <div class="card text-center">
                    <h3>Set ${this.currentSet} of ${sets}</h3>
                    ${this.isResting ? this.renderRestTimer() : this.renderWorkingState()}
                </div>

                <div class="card">
                    <h4>Sets Completed:</h4>
                    ${this.renderCompletedSets(currentExercise, sets)}
                </div>

                ${this.renderWorkoutActions()}
            </div>
        `;

        console.log('Generated HTML content:', content);

        // Set up back button and hide bottom nav
        setTimeout(() => {
            document.getElementById('backBtn').style.display = 'block';
            document.getElementById('backBtn').onclick = () => this.confirmQuit();
            document.getElementById('bottomNav').style.display = 'none';
        }, 0);

        return content;
    },

    renderWorkingState() {
        return `
            <p style="margin: 1rem 0; font-size: 1.1rem;">Complete your set, then hit the button below</p>
            <button class="btn btn-success" onclick="WorkoutView.completeSet()">
                ✓ Set Complete
            </button>
        `;
    },

    renderRestTimer() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const colorClass = this.timerSeconds <= 5 ? 'complete' : (this.timerSeconds <= 10 ? 'warning' : '');

        return `
            <div class="timer-display ${colorClass}">${timeDisplay}</div>
            <p style="margin-bottom: 1rem;">Rest between sets</p>
            <button class="btn" onclick="WorkoutView.skipRest()">
                Skip Rest
            </button>
        `;
    },

    renderCompletedSets(exercise, sets) {
        const targetSets = parseInt(sets || exercise.sets) || 3;
        const completed = exercise.completedSets.length;

        let html = '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">';
        for (let i = 0; i < targetSets; i++) {
            const isDone = i < completed;
            html += `<div class="badge ${isDone ? 'badge-success' : ''}" style="${!isDone ? 'background: var(--border); color: var(--text-light);' : ''}">
                ${i + 1}
            </div>`;
        }
        html += '</div>';
        return html;
    },

    renderWorkoutActions() {
        return `
            <button class="btn btn-outline" onclick="WorkoutView.skipExercise()">
                Skip Exercise
            </button>
            <button class="btn btn-danger" onclick="WorkoutView.confirmQuit()">
                Quit Workout
            </button>
        `;
    },

    completeSet() {
        const currentExercise = this.currentWorkout.exercises[this.currentExerciseIndex];
        currentExercise.completedSets.push({
            set: this.currentSet,
            timestamp: new Date()
        });

        // Get exercise data to check default sets if needed
        const exerciseData = DataManager.getExercise(currentExercise.exerciseId);
        const targetSets = parseInt(currentExercise.sets || (exerciseData ? exerciseData.sets : '3')) || 3;

        if (this.currentSet >= targetSets) {
            // Exercise complete, move to next
            this.nextExercise();
        } else {
            // More sets to go, start rest timer
            this.currentSet++;
            this.startRestTimer();
        }
    },

    startRestTimer() {
        this.isResting = true;
        const settings = DataManager.getSettings();
        this.timerSeconds = settings.defaultRestTime || 30;

        this.updateDisplay();

        this.timerInterval = setInterval(() => {
            this.timerSeconds--;

            if (this.timerSeconds <= 0) {
                this.endRestTimer();
                this.playNotification();
            } else {
                // Update timer display
                this.updateDisplay();
            }
        }, 1000);
    },

    endRestTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isResting = false;
        this.updateDisplay();
    },

    skipRest() {
        this.endRestTimer();
    },

    nextExercise() {
        this.currentExerciseIndex++;
        this.currentSet = 1;

        if (this.currentExerciseIndex >= this.currentWorkout.exercises.length) {
            this.completeWorkout();
        } else {
            this.isResting = false;
            this.updateDisplay();
        }
    },

    skipExercise() {
        if (confirm('Skip this exercise?')) {
            this.nextExercise();
        }
    },

    completeWorkout() {
        const endTime = new Date();
        const duration = endTime - this.startTime;

        const log = {
            routineId: this.currentWorkout.routineId,
            routineName: this.currentWorkout.routineName,
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: duration,
            exercises: this.currentWorkout.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                targetSets: ex.sets,
                targetReps: ex.reps,
                completedSets: ex.completedSets.length
            }))
        };

        DataManager.saveWorkoutLog(log);

        // Clear workout state
        this.currentWorkout = null;
        this.currentExerciseIndex = 0;
        this.currentSet = 1;

        // Show completion screen
        this.showCompletionScreen(log);
    },

    showCompletionScreen(log) {
        const content = `
            <div class="workout-complete text-center">
                <div style="font-size: 5rem; margin: 2rem 0;">🎉</div>
                <h2>Workout Complete!</h2>
                <div class="card mt-1">
                    <h3>${log.routineName}</h3>
                    <div class="card-meta">
                        <span>Duration: ${Utils.formatDuration(log.duration)}</span>
                        <span>Exercises: ${log.exercises.length}</span>
                    </div>
                </div>
                <button class="btn btn-success" onclick="App.navigate('dashboard')">
                    Done
                </button>
                <button class="btn btn-outline" onclick="App.navigate('history')">
                    View History
                </button>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = 'Complete!';
        document.getElementById('bottomNav').style.display = 'flex';
    },

    confirmQuit() {
        if (this.currentWorkout && confirm('Quit workout? Progress will not be saved.')) {
            this.quitWorkout();
        } else if (!this.currentWorkout) {
            App.navigate('dashboard');
        }
    },

    quitWorkout() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.currentWorkout = null;
        this.currentExerciseIndex = 0;
        this.currentSet = 1;
        this.isResting = false;

        document.getElementById('bottomNav').style.display = 'flex';
        App.navigate('dashboard');
    },

    playNotification() {
        // Vibration for mobile devices
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }

        // Audio notification (simple beep using Web Audio API)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio not supported, silent fail
        }
    }
};
