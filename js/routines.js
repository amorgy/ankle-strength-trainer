// Routines View
const RoutinesView = {
    render() {
        const routines = DataManager.getRoutines();

        return `
            <div class="routines-view">
                ${routines.length === 0 ? this.renderEmpty() : this.renderList(routines)}
                <button class="btn btn-success" onclick="RoutinesView.showAddRoutine()">
                    + Create New Routine
                </button>
            </div>
        `;
    },

    renderEmpty() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No routines yet</div>
                <p style="color: var(--text-light);">Create a routine by combining exercises</p>
            </div>
        `;
    },

    renderList(routines) {
        return `
            <div class="routine-list">
                ${routines.map(routine => {
                    const exerciseCount = routine.exercises ? routine.exercises.length : 0;
                    return `
                        <div class="card" onclick="RoutinesView.showRoutineDetail('${routine.id}')">
                            <div class="card-title">${routine.name}</div>
                            <div class="card-subtitle">${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    showRoutineDetail(id) {
        const routine = DataManager.getRoutine(id);
        if (!routine) return;

        const exercises = routine.exercises || [];
        const allExercises = DataManager.getExercises();

        const content = `
            <div class="routine-detail">
                <h2>${routine.name}</h2>
                ${exercises.length === 0 ? `
                    <div class="empty-state">
                        <p>No exercises in this routine yet</p>
                    </div>
                ` : `
                    <div class="exercise-list">
                        ${exercises.map((ex, index) => {
                            const exercise = allExercises.find(e => e.id === ex.exerciseId);
                            if (!exercise) return '';
                            return `
                                <div class="card">
                                    <div class="card-title">${index + 1}. ${exercise.name}</div>
                                    <div class="card-meta">
                                        <span>Sets: ${ex.sets}</span>
                                        <span>Reps: ${ex.reps}</span>
                                    </div>
                                    <div class="card-description">${exercise.description}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
                <button class="btn btn-success" onclick="WorkoutView.startWorkout('${id}')">
                    ▶️ Start Workout
                </button>
                <button class="btn" onclick="RoutinesView.editRoutine('${id}')">
                    Edit Routine
                </button>
                <button class="btn btn-danger" onclick="RoutinesView.deleteRoutine('${id}')">
                    Delete Routine
                </button>
                <button class="btn btn-secondary" onclick="App.navigate('routines')">
                    Back to List
                </button>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = routine.name;
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('routines');
    },

    showAddRoutine() {
        this.showRoutineForm(null);
    },

    editRoutine(id) {
        const routine = DataManager.getRoutine(id);
        this.showRoutineForm(routine);
    },

    showRoutineForm(routine) {
        const isEdit = routine !== null;
        const formData = routine || {
            name: '',
            exercises: []
        };

        const allExercises = DataManager.getExercises();

        const content = `
            <div class="routine-form">
                <h2>${isEdit ? 'Edit' : 'Create'} Routine</h2>
                <form id="routineForm" onsubmit="RoutinesView.saveRoutine(event)">
                    ${isEdit ? `<input type="hidden" name="id" value="${routine.id}">` : ''}

                    <div class="form-group">
                        <label>Routine Name *</label>
                        <input type="text" name="name" value="${formData.name}" placeholder="e.g., Morning Ankle Routine" required>
                    </div>

                    <h3>Exercises</h3>
                    <div id="exercisesList">
                        ${formData.exercises.map((ex, index) => this.renderExerciseRow(ex, index, allExercises)).join('')}
                    </div>

                    <button type="button" class="btn btn-outline" onclick="RoutinesView.addExerciseRow()">
                        + Add Exercise
                    </button>

                    <button type="submit" class="btn btn-success mt-1">
                        ${isEdit ? 'Update' : 'Create'} Routine
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="App.navigate('routines')">
                        Cancel
                    </button>
                </form>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = isEdit ? 'Edit Routine' : 'New Routine';
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('routines');
    },

    renderExerciseRow(exerciseData, index, allExercises) {
        const exercise = exerciseData ? allExercises.find(e => e.id === exerciseData.exerciseId) : null;

        return `
            <div class="card" id="exercise-row-${index}">
                <div class="form-group">
                    <label>Exercise</label>
                    <select name="exerciseId[]" onchange="RoutinesView.updateExerciseDefaults(${index})" required>
                        <option value="">Select an exercise...</option>
                        ${allExercises.map(ex => `
                            <option value="${ex.id}"
                                data-sets="${ex.sets}"
                                data-reps="${ex.reps}"
                                ${exerciseData && ex.id === exerciseData.exerciseId ? 'selected' : ''}>
                                ${ex.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Sets</label>
                        <input type="text" name="sets[]" value="${exerciseData ? exerciseData.sets : (exercise ? exercise.sets : '3')}" required>
                    </div>
                    <div class="form-group">
                        <label>Reps</label>
                        <input type="text" name="reps[]" value="${exerciseData ? exerciseData.reps : (exercise ? exercise.reps : '10')}" required>
                    </div>
                </div>
                <button type="button" class="btn btn-danger btn-small" onclick="RoutinesView.removeExerciseRow(${index})">
                    Remove
                </button>
            </div>
        `;
    },

    addExerciseRow() {
        const container = document.getElementById('exercisesList');
        const index = container.children.length;
        const allExercises = DataManager.getExercises();
        container.insertAdjacentHTML('beforeend', this.renderExerciseRow(null, index, allExercises));
    },

    removeExerciseRow(index) {
        const row = document.getElementById(`exercise-row-${index}`);
        if (row) row.remove();
    },

    updateExerciseDefaults(index) {
        const row = document.getElementById(`exercise-row-${index}`);
        const select = row.querySelector('select[name="exerciseId[]"]');
        const selectedOption = select.options[select.selectedIndex];

        if (selectedOption && selectedOption.value) {
            const sets = selectedOption.getAttribute('data-sets');
            const reps = selectedOption.getAttribute('data-reps');

            row.querySelector('input[name="sets[]"]').value = sets;
            row.querySelector('input[name="reps[]"]').value = reps;
        }
    },

    saveRoutine(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const exerciseIds = formData.getAll('exerciseId[]');
        const sets = formData.getAll('sets[]');
        const reps = formData.getAll('reps[]');

        const exercises = exerciseIds.map((id, index) => ({
            exerciseId: id,
            sets: sets[index],
            reps: reps[index]
        })).filter(ex => ex.exerciseId); // Remove empty rows

        const routine = {
            id: formData.get('id') || undefined,
            name: formData.get('name'),
            exercises: exercises
        };

        if (exercises.length === 0) {
            alert('Please add at least one exercise to the routine');
            return;
        }

        DataManager.saveRoutine(routine);
        App.navigate('routines');
    },

    deleteRoutine(id) {
        if (confirm('Delete this routine? It will also be removed from your calendar.')) {
            DataManager.deleteRoutine(id);
            App.navigate('routines');
        }
    }
};
