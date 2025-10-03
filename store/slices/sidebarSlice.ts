import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
    leftSection: boolean;
    selectedSection: string;
    loaderContent: {
        isActive: boolean;
        loaderId: string | null;
    };
}

const initialState: SidebarState = {
    leftSection: false,
    selectedSection: 'dashboard', // default section
    loaderContent: {
        isActive: false,
        loaderId: null,
    },
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleLeftSection: (state) => {
            state.leftSection = !state.leftSection;
        },
        setLeftSection: (state, action: PayloadAction<boolean>) => {
            state.leftSection = action.payload;
        },
        setSelectedSection: (state, action: PayloadAction<string>) => {
            state.selectedSection = action.payload;
            // Reset loader content when changing sections
            if (action.payload !== 'services') {
                state.loaderContent.isActive = false;
                state.loaderContent.loaderId = null;
            }
        },
        setLoaderContent: (state, action: PayloadAction<{ loaderId: string }>) => {
            state.loaderContent.isActive = true;
            state.loaderContent.loaderId = action.payload.loaderId;
            state.selectedSection = 'services'; // Navigate to services section
        },
        clearLoaderContent: (state) => {
            state.loaderContent.isActive = false;
            state.loaderContent.loaderId = null;
        },
    },
});

export const { toggleLeftSection, setLeftSection, setSelectedSection, setLoaderContent, clearLoaderContent } = sidebarSlice.actions;
export default sidebarSlice.reducer;