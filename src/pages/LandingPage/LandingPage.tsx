/* eslint-disable @typescript-eslint/no-explicit-any */
import './LandingPage.css';
import { fetch } from '../../utils/httpUtils';

function navigate(url: string) {
    window.location.href = url;
}

async function auth() {
    try {
        const response = await fetch('v1/api/google/getUrl');

        navigate(response?.data?.data);
    } catch (err) {
        console.log({ err });
    }
}

function LandingPage() {
    return (
        <div>
            <div>
                <h1>Google Calendar App</h1>
            </div>
            <div>
                <button onClick={() => auth()} className="button">
                    Sign in with google
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
