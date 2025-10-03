import React from 'react';
import { useAppSelector } from '../../store/hooks';
import DashboardSection from './DashboardSection';
import PartnerSection from './PartnerSection';
import LoadersSection from './LoadersSection';
import ServicesSection from './ServicesSection';
import SettingsSection from './SettingsSection';

export default function MainContent() {
    const selectedSection = useAppSelector((state) => state.sidebar.selectedSection);

    console.log("Current selected section:", selectedSection);

    const renderSection = () => {
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