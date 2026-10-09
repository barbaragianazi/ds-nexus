// Interface (manager) do Storybook: aplica o tema Nexus e adiciona o botão que alterna entre claro e escuro.
import React, { useCallback, useEffect, useState } from 'react';
import { addons, types, useStorybookApi } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { nexusDark, nexusLight } from './theme';

const STORAGE_KEY = 'nexus-sb-theme';
const EVENT = 'nexus/theme-change';
const ADDON_ID = 'nexus/theme-toggle';

type Mode = 'dark' | 'light';

const readMode = (): Mode => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

const applyMode = (mode: Mode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // storage indisponível: segue sem persistir
  }
};

const themes = { dark: nexusDark, light: nexusLight };

addons.setConfig({ theme: themes[readMode()] });

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const ThemeToggle = () => {
  const api = useStorybookApi();
  const [mode, setMode] = useState<Mode>(readMode);

  useEffect(() => {
    applyMode(mode);
    api.getChannel()?.emit(EVENT, mode);
  }, [api, mode]);

  const toggle = useCallback(() => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    api.setOptions({ theme: themes[next] });
    setMode(next);
  }, [api, mode]);

  const label = mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro';

  return (
    <IconButton title={label} aria-label={label} onClick={toggle}>
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    type: types.TOOL,
    title: 'Tema',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <ThemeToggle />,
  });
});

// O Storybook monta o título da aba como "Grupo / Componente - História ⋅ Storybook"
// e não usa o brandTitle. Reescreve para "Componente ⋅ Nexus/DS".
const BRAND = 'Nexus/DS';

const formatTitle = (raw: string) => {
  if (raw.endsWith(` ⋅ ${BRAND}`) || raw === BRAND) return raw; // já formatado: evita loop do observer
  const page = raw.replace(/\s*⋅\s*Storybook$/, '');
  if (page === 'Storybook' || page === '') return BRAND;
  const component = page.split(' - ')[0].split(' / ').pop()!.trim();
  return `${component} ⋅ ${BRAND}`;
};

const syncTitle = () => {
  const next = formatTitle(document.title);
  if (document.title !== next) document.title = next;
};

const titleEl = document.querySelector('title');
if (titleEl) {
  new MutationObserver(syncTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });
  syncTitle();
}
