'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

type TMobileNavigation = {
    title?: string;
}

export function MobileNavigation({ title = 'Star Wars Characters' }: TMobileNavigation) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = (): void => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string): void => {
        router.push(path);
        setMobileOpen(false);
    };

    const navigationItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Search', icon: <SearchIcon />, path: '/' },
        { text: 'Characters', icon: <PersonIcon />, path: '/' },
    ];

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    Menu
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navigationItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    if (!isMobile) {
        return <></>;
    }

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

