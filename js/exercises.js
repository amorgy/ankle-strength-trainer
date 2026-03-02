// Exercise Library View
const ExercisesView = {
    render() {
        const exercises = DataManager.getExercises();

        return `
            <div class="exercises-view">
                ${exercises.length === 0 ? this.renderEmpty() : this.renderList(exercises)}
                <button class="btn btn-success" onclick="ExercisesView.showAddExercise()">
                    + Add New Exercise
                </button>
            </div>
        `;
    },

    renderEmpty() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">💪</div>
                <div class="empty-state-text">No exercises yet</div>
            </div>
        `;
    },

    renderList(exercises) {
        return `
            <div class="exercise-list">
                ${exercises.map(ex => `
                    <div class="card" onclick="ExercisesView.showExerciseDetail('${ex.id}')">
                        <div class="card-title">${ex.name}</div>
                        <div class="card-meta">
                            <span>Sets: ${ex.sets}</span>
                            <span>Reps: ${ex.reps}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showExerciseDetail(id) {
        const exercise = DataManager.getExercise(id);
        if (!exercise) return;

        const content = `
            <div class="exercise-detail">
                <h2>${exercise.name}</h2>
                <div class="card">
                    <div class="card-meta mb-1">
                        <span><strong>Sets:</strong> ${exercise.sets}</span>
                        <span><strong>Reps:</strong> ${exercise.reps}</span>
                    </div>
                    <div class="card-description">
                        ${exercise.description}
                    </div>
                    ${exercise.videoUrl ? `
                        <a href="${exercise.videoUrl}" target="_blank" class="btn btn-outline btn-small">
                            📹 Watch Video
                        </a>
                    ` : ''}
                    ${exercise.imageUrl ? `
                        <a href="${exercise.imageUrl}" target="_blank" class="btn btn-outline btn-small">
                            🖼️ View Image
                        </a>
                    ` : ''}
                </div>
                <button class="btn" onclick="ExercisesView.editExercise('${id}')">
                    Edit Exercise
                </button>
                <button class="btn btn-danger" onclick="ExercisesView.deleteExercise('${id}')">
                    Delete Exercise
                </button>
                <button class="btn btn-secondary" onclick="App.navigate('exercises')">
                    Back to List
                </button>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = exercise.name;
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('exercises');
    },

    showAddExercise() {
        this.showExerciseForm(null);
    },

    editExercise(id) {
        const exercise = DataManager.getExercise(id);
        this.showExerciseForm(exercise);
    },

    showExerciseForm(exercise) {
        const isEdit = exercise !== null;
        const formData = exercise || {
            name: '',
            sets: 3,
            reps: '10',
            description: '',
            videoUrl: '',
            imageUrl: ''
        };

        const content = `
            <div class="exercise-form">
                <h2>${isEdit ? 'Edit' : 'Add'} Exercise</h2>
                <form id="exerciseForm" onsubmit="ExercisesView.saveExercise(event)">
                    ${isEdit ? `<input type="hidden" name="id" value="${exercise.id}">` : ''}

                    <div class="form-group">
                        <label>Exercise Name *</label>
                        <input type="text" name="name" value="${formData.name}" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Sets *</label>
                            <input type="text" name="sets" value="${formData.sets}" required>
                        </div>
                        <div class="form-group">
                            <label>Reps *</label>
                            <input type="text" name="reps" value="${formData.reps}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description">${formData.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Video URL (optional)</label>
                        <input type="url" name="videoUrl" value="${formData.videoUrl}" placeholder="https://youtube.com/...">
                    </div>

                    <div class="form-group">
                        <label>Image URL (optional)</label>
                        <input type="url" name="imageUrl" value="${formData.imageUrl}" placeholder="https://...">
                    </div>

                    <button type="submit" class="btn btn-success">
                        ${isEdit ? 'Update' : 'Add'} Exercise
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="App.navigate('exercises')">
                        Cancel
                    </button>
                </form>
            </div>
        `;

        document.getElementById('mainContent').innerHTML = content;
        document.getElementById('pageTitle').textContent = isEdit ? 'Edit Exercise' : 'New Exercise';
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('backBtn').onclick = () => App.navigate('exercises');
    },

    saveExercise(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const exercise = {
            id: formData.get('id') || undefined,
            name: formData.get('name'),
            sets: formData.get('sets'),
            reps: formData.get('reps'),
            description: formData.get('description'),
            videoUrl: formData.get('videoUrl'),
            imageUrl: formData.get('imageUrl')
        };

        DataManager.saveExercise(exercise);
        App.navigate('exercises');
    },

    deleteExercise(id) {
        if (confirm('Delete this exercise? It will be removed from all routines.')) {
            DataManager.deleteExercise(id);
            App.navigate('exercises');
        }
    }
};
