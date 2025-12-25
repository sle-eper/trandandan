import { ProfileForm } from './components/ProfileForm';


export async function ProfileApp() {
    const profileForm = new ProfileForm();
    profileForm.mount('dashboard-content');
}

ProfileApp();