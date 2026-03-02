// Data Management & LocalStorage
const DataManager = {
    // Initialize data with pre-populated exercises
    init() {
        if (!localStorage.getItem('exercises')) {
            this.resetExercises();
        }
        if (!localStorage.getItem('routines')) {
            localStorage.setItem('routines', JSON.stringify([]));
        }
        if (!localStorage.getItem('calendar')) {
            localStorage.setItem('calendar', JSON.stringify({}));
        }
        if (!localStorage.getItem('workoutHistory')) {
            localStorage.setItem('workoutHistory', JSON.stringify([]));
        }
        if (!localStorage.getItem('settings')) {
            this.saveSettings({ defaultRestTime: 30 });
        }
    },

    // Pre-populated exercises
    getDefaultExercises() {
        return [
            {
                id: 'ex1',
                name: 'Straight-Leg Single-Leg Calf Raise',
                sets: 3,
                reps: '6-8',
                description: 'Stand on one foot. Knee straight. Rise up slowly (3 sec), lower slowly (3 sec). Add weight as tolerated. Builds propulsion strength (gastroc).',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex2',
                name: 'Bent-Knee Single-Leg Calf Raise',
                sets: 3,
                reps: '6-8',
                description: 'Same as above but knee slightly bent throughout. Targets soleus — critical for long-run fatigue resistance.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex3',
                name: 'ToePro Heel Raise Warmup',
                sets: 3,
                reps: '15',
                description: 'Toes placed at end of ToePro platform. Raise both heels up and down under control. Focus on smooth arch engagement. Warm-up and endurance builder.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex4',
                name: 'ToePro Eccentric Heel Raise',
                sets: '3-4',
                reps: '6-8',
                description: 'Rise up with both feet. Shift to affected foot. Lower slowly (5 sec). Maintain arch control. Primary tendon capacity builder.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex5',
                name: 'ToePro Step Up',
                sets: 3,
                reps: '10-15',
                description: 'Toes on higher portion of ToePro. Raise heels and allow controlled inward roll (pronation control). Strengthens forefoot stability and first ray mechanics.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex6',
                name: 'ToePro Single-Leg Step Up',
                sets: 3,
                reps: '10',
                description: 'Arch centered on ToePro (perpendicular to device). Single-leg controlled heel raises. Focus on balance and midfoot control.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex7',
                name: 'Band Eversion',
                sets: 3,
                reps: '12 slow',
                description: 'Loop band around forefoot. Push foot outward slowly (eversion), return under control. Strengthens peroneals.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex8',
                name: 'Band Inversion',
                sets: 3,
                reps: '12 slow',
                description: 'Pull foot inward against band (inversion). Control both directions. Strengthens tibialis posterior to balance lateral structures.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex9',
                name: 'Single-Leg RDL',
                sets: '2-3',
                reps: '6-8',
                description: 'Barefoot if possible. Hinge at hip, slight knee bend. Keep hips level. Optional dumbbell. Improves proximal control to reduce ankle overload.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex10',
                name: 'Axis Board – Controlled Lateral Taps',
                sets: 2,
                reps: '45 sec',
                description: 'Slow side-to-side tilting. Keep hips steady. No fast wobbling. Builds lateral ankle control.',
                videoUrl: '',
                imageUrl: ''
            },
            {
                id: 'ex11',
                name: 'Isometric Eversion Hold (Post-Run)',
                sets: 3,
                reps: '30 sec',
                description: 'Evert foot against band and hold. Good after runs to reduce post-run soreness.',
                videoUrl: '',
                imageUrl: ''
            }
        ];
    },

    // Exercise CRUD
    getExercises() {
        return JSON.parse(localStorage.getItem('exercises')) || [];
    },

    getExercise(id) {
        const exercises = this.getExercises();
        return exercises.find(ex => ex.id === id);
    },

    saveExercise(exercise) {
        const exercises = this.getExercises();
        const index = exercises.findIndex(ex => ex.id === exercise.id);

        if (index >= 0) {
            exercises[index] = exercise;
        } else {
            exercise.id = 'ex' + Date.now();
            exercises.push(exercise);
        }

        localStorage.setItem('exercises', JSON.stringify(exercises));
        return exercise;
    },

    deleteExercise(id) {
        const exercises = this.getExercises().filter(ex => ex.id !== id);
        localStorage.setItem('exercises', JSON.stringify(exercises));
    },

    resetExercises() {
        localStorage.setItem('exercises', JSON.stringify(this.getDefaultExercises()));
    },

    // Routine CRUD
    getRoutines() {
        return JSON.parse(localStorage.getItem('routines')) || [];
    },

    getRoutine(id) {
        const routines = this.getRoutines();
        return routines.find(r => r.id === id);
    },

    saveRoutine(routine) {
        const routines = this.getRoutines();
        const index = routines.findIndex(r => r.id === routine.id);

        if (index >= 0) {
            routines[index] = routine;
        } else {
            routine.id = 'routine' + Date.now();
            routines.push(routine);
        }

        localStorage.setItem('routines', JSON.stringify(routines));
        return routine;
    },

    deleteRoutine(id) {
        const routines = this.getRoutines().filter(r => r.id !== id);
        localStorage.setItem('routines', JSON.stringify(routines));

        // Remove from calendar
        const calendar = this.getCalendar();
        Object.keys(calendar).forEach(date => {
            if (calendar[date] === id) {
                delete calendar[date];
            }
        });
        this.saveCalendar(calendar);
    },

    // Calendar CRUD
    getCalendar() {
        return JSON.parse(localStorage.getItem('calendar')) || {};
    },

    getWorkoutForDate(dateStr) {
        const calendar = this.getCalendar();
        const routineId = calendar[dateStr];
        return routineId ? this.getRoutine(routineId) : null;
    },

    scheduleWorkout(dateStr, routineId) {
        const calendar = this.getCalendar();
        if (routineId) {
            calendar[dateStr] = routineId;
        } else {
            delete calendar[dateStr];
        }
        this.saveCalendar(calendar);
    },

    saveCalendar(calendar) {
        localStorage.setItem('calendar', JSON.stringify(calendar));
    },

    // Workout History CRUD
    getWorkoutHistory() {
        return JSON.parse(localStorage.getItem('workoutHistory')) || [];
    },

    saveWorkoutLog(log) {
        const history = this.getWorkoutHistory();
        log.id = 'log' + Date.now();
        history.unshift(log); // Add to beginning
        localStorage.setItem('workoutHistory', JSON.stringify(history));
        return log;
    },

    deleteWorkoutLog(id) {
        const history = this.getWorkoutHistory().filter(log => log.id !== id);
        localStorage.setItem('workoutHistory', JSON.stringify(history));
    },

    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem('settings')) || { defaultRestTime: 30 };
    },

    saveSettings(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    },

    // Reset all data
    resetAllData() {
        if (confirm('Are you sure? This will delete all routines, calendar entries, and workout history. Exercises will be reset to defaults.')) {
            localStorage.clear();
            this.init();
            location.reload();
        }
    }
};

// Utility functions
const Utils = {
    formatDate(date) {
        return date.toISOString().split('T')[0];
    },

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    },

    parseTimeInput(timeStr) {
        // Parse formats like "45 sec", "6-8", "10-15", "3-4"
        return timeStr;
    },

    getDayName(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    },

    getMonthName(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
};

// Initialize data on load
DataManager.init();
