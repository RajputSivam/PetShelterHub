const API_BASE = window.location.port && window.location.port !== '3000'
    ? `http://${window.location.hostname || 'localhost'}:3000/api`
    : '/api';

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : null;
    if (!response.ok) throw new Error(payload?.message || 'Something went wrong');
    if (!payload) throw new Error('Something went wrong');
    return payload;
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}

function setFormStatus(form, message, isError = false) {
    const status = form.querySelector('.form-status');
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    status.classList.remove('is-pending');
}

function bindSubmissionForms() {
    document.querySelectorAll('form[data-endpoint]:not(#login-form):not(#register-form)').forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = form.querySelector('[type="submit"]');
            const values = Object.fromEntries(new FormData(form).entries());
            const status = form.querySelector('.form-status');
            status.textContent = 'Sending...';
            status.classList.remove('is-error');
            status.classList.add('is-pending');
            button.disabled = true;
            try {
                const result = await apiRequest(form.dataset.endpoint, {
                    method: 'POST',
                    body: JSON.stringify(values)
                });
                setFormStatus(form, result.message || 'Thank you. We have received your details.');
                form.reset();
            } catch (error) {
                setFormStatus(form, error.message, true);
            } finally {
                button.disabled = false;
            }
        });
    });
}

async function loadPets() {
    const petList = document.querySelector('#pet-list');
    if (!petList) return;
    try {
        const pets = await apiRequest('/pets');
        const petSelect = document.querySelector('#adoption-pet');
        if (!pets.length) {
            petList.innerHTML = '<p class="empty-state">No pets are listed right now. Please check back soon.</p>';
            return;
        }

        petList.innerHTML = pets.map((pet, index) => `
			<article class="pet-card" style="animation-delay:${index * 70}ms">
				<div class="pet-photo-wrap"><img class="pet-photo" src="${escapeHTML(pet.image_url)}" alt="${escapeHTML(pet.name)} the ${escapeHTML(pet.species.toLowerCase())}" loading="lazy"></div>
				<div class="pet-info">
					<div class="pet-info-top"><h3>${escapeHTML(pet.name)}</h3><span class="pet-species">${escapeHTML(pet.species)}</span></div>
					<p class="pet-details">${escapeHTML(pet.breed)} · ${escapeHTML(pet.age)} · ${escapeHTML(pet.sex)}</p>
					<p class="pet-description">${escapeHTML(pet.description)}</p>
					<button class="button button-dark pet-adopt" type="button" data-adopt-pet="${Number(pet.id)}">Ask about ${escapeHTML(pet.name)} <span aria-hidden="true">↘</span></button>
				</div>
			</article>`).join('');

        petSelect.innerHTML += pets.map((pet) => `<option value="${Number(pet.id)}">${escapeHTML(pet.name)} · ${escapeHTML(pet.species)}</option>`).join('');
        petList.querySelectorAll('[data-adopt-pet]').forEach((button) => {
            button.addEventListener('click', () => {
                petSelect.value = button.dataset.adoptPet;
                document.querySelector('#adoption-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
                petSelect.focus({ preventScroll: true });
            });
        });
    } catch (error) {
        petList.innerHTML = `<p class="empty-state">${escapeHTML(error.message)} Check that the PetShelterHub server and database are running.</p>`;
    }
}

async function loadCurrentUser() {
    const accountLink = document.querySelector('.nav-account');
    if (!accountLink) return;
    try {
        const { user } = await apiRequest('/auth/me');
        if (user) {
            accountLink.textContent = `Hi, ${user.name.split(' ')[0]}`;
            accountLink.href = '#sign-out';
            accountLink.addEventListener('click', async (event) => {
                event.preventDefault();
                await apiRequest('/auth/logout', { method: 'POST' });
                window.location.assign('/login.html');
            });
            ['adoption', 'donation', 'volunteer'].forEach((prefix) => {
                const name = document.querySelector(`#${prefix}-name`);
                const email = document.querySelector(`#${prefix}-email`);
                if (name) name.value = user.name;
                if (email) email.value = user.email;
            });
        }
    } catch (error) {
        accountLink.textContent = 'Sign in';
    }
}

function bindAuthTabs() {
    const tabs = document.querySelectorAll('[data-auth-tab]');
    if (!tabs.length) return;
    const title = document.querySelector('#auth-title');
    const subtitle = document.querySelector('#auth-subtitle');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
        const isRegister = tab.dataset.authTab === 'register';
        tabs.forEach((item) => {
            const active = item === tab;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', String(active));
        });
        document.querySelector('#login-form').hidden = isRegister;
        document.querySelector('#register-form').hidden = !isRegister;
        title.textContent = isRegister ? 'Join the family.' : 'Welcome back.';
        subtitle.textContent = isRegister ? 'Create an account to stay close to the cause.' : 'Sign in to your PetShelterHub account.';
    }));
}

async function redirectIfSignedIn() {
    if (!document.querySelector('#login-form')) return;
    try {
        const { user } = await apiRequest('/auth/me');
        if (user) window.location.replace('/');
    } catch (error) {
        return;
    }
}

async function handleAuthSuccess(result, form) {
    setFormStatus(form, `Welcome${result.user?.name ? `, ${result.user.name}` : ''}. Taking you home...`);
    window.setTimeout(() => window.location.assign('/'), 450);
}

document.addEventListener('DOMContentLoaded', () => {
    bindSubmissionForms();
    loadPets();
    loadCurrentUser();
    bindAuthTabs();
    redirectIfSignedIn();

    document.querySelectorAll('#login-form, #register-form').forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = form.querySelector('[type="submit"]');
            button.disabled = true;
            try {
                const result = await apiRequest(form.dataset.endpoint, {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
                });
                await handleAuthSuccess(result, form);
            } catch (error) {
                setFormStatus(form, error.message, true);
            } finally {
                button.disabled = false;
            }
        });
    });
});
