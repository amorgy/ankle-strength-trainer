// Calendar View
const CalendarView = {
    currentDate: new Date(),

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        return `
            <div class="calendar-view">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <button class="btn btn-small" onclick="CalendarView.previousMonth()">←</button>
                        <h2>${this.getMonthName(month)} ${year}</h2>
                        <button class="btn btn-small" onclick="CalendarView.nextMonth()">→</button>
                    </div>
                    ${this.renderCalendar(year, month)}
                </div>

                <div class="card">
                    <h3>Upcoming Workouts</h3>
                    ${this.renderUpcoming()}
                </div>
            </div>
        `;
    },

    renderCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendar = DataManager.getCalendar();
        const today = Utils.formatDate(new Date());

        let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center;">';

        // Day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            html += `<div style="font-weight: 600; color: var(--text-light); font-size: 0.8rem;">${day}</div>`;
        });

        // Empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div></div>';
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = Utils.formatDate(date);
            const hasWorkout = calendar[dateStr];
            const isToday = dateStr === today;

            let style = 'padding: 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;';
            if (isToday) {
                style += 'border: 2px solid var(--primary);';
            }
            if (hasWorkout) {
                style += 'background: var(--primary); color: white; font-weight: 600;';
            } else {
                style += 'background: var(--bg);';
            }

            html += `<div style="${style}" onclick="CalendarView.selectDate('${dateStr}')">${day}</div>`;
        }

        html += '</div>';
        return html;
    },

    renderUpcoming() {
        const calendar = DataManager.getCalendar();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = Object.entries(calendar)
            .map(([dateStr, routineId]) => ({
                date: new Date(dateStr + 'T00:00:00'),
                dateStr,
                routineId,
                routine: DataManager.getRoutine(routineId)
            }))
            .filter(item => item.date >= today && item.routine)
            .sort((a, b) => a.date - b.date)
            .slice(0, 5);

        if (upcoming.length === 0) {
            return '<p style="color: var(--text-light);">No upcoming workouts scheduled</p>';
        }

        return upcoming.map(item => `
            <div class="list-item" onclick="RoutinesView.showRoutineDetail('${item.routineId}')">
                <div class="list-item-title">${item.routine.name}</div>
                <div class="list-item-subtitle">${Utils.getMonthName(item.dateStr)} (${Utils.getDayName(item.dateStr)})</div>
            </div>
        `).join('');
    },

    selectDate(dateStr) {
        const calendar = DataManager.getCalendar();
        const currentRoutineId = calendar[dateStr];
        const routines = DataManager.getRoutines();

        const date = new Date(dateStr + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const content = `
            <div class="date-schedule">
                <h2>${formattedDate}</h2>
                <div class="form-group">
                    <label>Schedule a workout:</label>
                    <select id="routineSelect" class="form-control">
                        <option value="">-- No workout --</option>
                        ${routines.map(r => `
                            <option value="${r.id}" ${currentRoutineId === r.id ? 'selected' : ''}>
                                ${r.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <button class="btn btn-success" onclick="CalendarView.saveSchedule('${dateStr}')">
                    Save
                </button>
                <button class="btn btn-secondary" onclick="App.navigate('calendar')">
                    Cancel
                </button>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = 'Schedule';
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('calendar');
    },

    saveSchedule(dateStr) {
        const select = document.getElementById('routineSelect');
        const routineId = select.value || null;

        DataManager.scheduleWorkout(dateStr, routineId);
        App.navigate('calendar');
    },

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        App.navigate('calendar');
    },

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        App.navigate('calendar');
    },

    getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }
};
