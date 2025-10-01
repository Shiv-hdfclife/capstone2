import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
    leftSection: boolean;
    selectedSection: string;
}

const initialState: SidebarState = {
    leftSection: false,
    selectedSection: 'dashboard', // default section
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
        },
    },
});

export const { toggleLeftSection, setLeftSection, setSelectedSection } = sidebarSlice.actions;
export default sidebarSlice.reducer;