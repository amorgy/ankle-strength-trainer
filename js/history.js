// Workout History View
const HistoryView = {
    render() {
        const history = DataManager.getWorkoutHistory();

        return `
            <div class="history-view">
                ${history.length === 0 ? this.renderEmpty() : this.renderStats(history)}
                ${history.length === 0 ? '' : this.renderList(history)}
            </div>
        `;
    },

    renderEmpty() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <div class="empty-state-text">No workout history yet</div>
                <p style="color: var(--text-light);">Complete a workout to see it here</p>
            </div>
        `;
    },

    renderStats(history) {
        const totalWorkouts = history.length;
        const totalTime = history.reduce((sum, log) => sum + log.duration, 0);
        const avgDuration = totalTime / totalWorkouts;

        // Recent workouts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentWorkouts = history.filter(log =>
            new Date(log.startTime) >= sevenDaysAgo
        ).length;

        return `
            <div class="card">
                <h3>Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${totalWorkouts}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">Total Workouts</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--success);">${recentWorkouts}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">Last 7 Days</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--warning);">${Utils.formatDuration(totalTime)}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">Total Time</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${Utils.formatDuration(avgDuration)}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">Avg Duration</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderList(history) {
        return `
            <h3 style="margin-top: 1.5rem; margin-bottom: 1rem;">Recent Workouts</h3>
            ${history.map(log => {
                const date = new Date(log.startTime);
                const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                const timeStr = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <div class="card" onclick="HistoryView.showWorkoutDetail('${log.id}')">
                        <div class="card-title">${log.routineName}</div>
                        <div class="card-meta">
                            <span>${dateStr} at ${timeStr}</span>
                            <span>Duration: ${Utils.formatDuration(log.duration)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    },

    showWorkoutDetail(logId) {
        const history = DataManager.getWorkoutHistory();
        const log = history.find(l => l.id === logId);

        if (!log) return;

        const date = new Date(log.startTime);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const content = `
            <div class="workout-detail">
                <h2>${log.routineName}</h2>
                <div class="card">
                    <div class="card-meta mb-1">
                        <span>${dateStr}</span>
                        <span>${timeStr}</span>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: var(--primary); text-align: center; margin: 1rem 0;">
                        ${Utils.formatDuration(log.duration)}
                    </div>
                </div>

                <h3>Exercises Completed</h3>
                ${log.exercises.map(ex => {
                    const exercise = DataManager.getExercise(ex.exerciseId);
                    if (!exercise) return '';

                    return `
                        <div class="card">
                            <div class="card-title">${exercise.name}</div>
                            <div class="card-meta">
                                <span>Target: ${ex.targetSets} × ${ex.targetReps}</span>
                                <span>Completed: ${ex.completedSets} sets</span>
                            </div>
                        </div>
                    `;
                }).join('')}

                <button class="btn btn-danger" onclick="HistoryView.deleteLog('${log.id}')">
                    Delete Log
                </button>
                <button class="btn btn-secondary" onclick="App.navigate('history')">
                    Back to History
                </button>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = 'Workout Detail';
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('history');
    },

    deleteLog(logId) {
        if (confirm('Delete this workout log?')) {
            DataManager.deleteWorkoutLog(logId);
            App.navigate('history');
        }
    }
};
