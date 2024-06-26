import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl } from '@mui/material';

const LanguageSwitcher = ({ style }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = React.useState(i18n.language);

    const handleChange = (event) => {
        const lng = event.target.value;
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    return (
        <FormControl variant="outlined" style={style}>
            <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                onChange={handleChange}
                style={{ backgroundColor: 'white' }}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hr">Hrvatski</MenuItem>
                <MenuItem value="hu">Magyar</MenuItem>
            </Select>
        </FormControl>
    );
};

export default LanguageSwitcher;
