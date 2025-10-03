import React from 'react';
import { useAppSelector } from '../../store/hooks';
import DashboardSection from './DashboardSection';
import PartnerSection from './PartnerSection';
import LoadersSection from './LoadersSection';
import ServicesSection from './ServicesSection';
import SettingsSection from './SettingsSection';
import LoaderContentSection from './LoaderContentSection';

export default function MainContent() {
    const selectedSection = useAppSelector((state) => state.sidebar.selectedSection);
    const loaderContent = useAppSelector((state) => state.sidebar.loaderContent);

    console.log("Current selected section:", selectedSection);
    console.log("Loader content state:", loaderContent);

    const renderSection = () => {
        // If loader content is active and we're in services section, show loader content
        if (selectedSection === 'services' && loaderContent.isActive && loaderContent.loaderId) {
            return <LoaderContentSection loaderId={loaderContent.loaderId} />;
        }

        switch (selectedSection) {
            case 'loaders':
                return <DashboardSection />;
            case 'partner':
                return <PartnerSection />;
            case 'dashboard':
                return <LoadersSection />;
            case 'services':
                return <ServicesSection />;
            case 'settings':
                return <SettingsSection />;
            default:
                return <DashboardSection />;
        }
    };

    return (
        <div>
            {renderSection()}
        </div>
    );
}