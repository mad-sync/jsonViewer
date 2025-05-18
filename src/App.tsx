import { useState } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import Editor from '@monaco-editor/react'
import ReactJson from 'react-json-view'
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    cardBg: string;
    cardShadow: string;
    text: string;
    border: string;
    errorBg: string;
    errorBorder: string;
    errorText: string;
    placeholder: string;
  }
}

const lightTheme = {
  background: '#f7f8fa',
  cardBg: '#fff',
  cardShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
  text: '#23272f',
  border: '#f0f0f0',
  errorBg: '#fff0f0',
  errorBorder: '#ffccc7',
  errorText: '#ff4d4f',
  placeholder: '#bbb',
}

const darkTheme = {
  background: '#181a1b',
  cardBg: '#23272f',
  cardShadow: '0 2px 12px 0 rgba(0,0,0,0.16)',
  text: '#f7f8fa',
  border: '#23272f',
  errorBg: '#2d1a1a',
  errorBorder: '#ff4d4f',
  errorText: '#ff6b6b',
  placeholder: '#888',
}

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s, color 0.2s;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 40px 0;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100vw;
  padding: 0 32px 0 32px;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-family: 'Inter', Arial, sans-serif;
  margin: 0;
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 32px;
  gap: 32px;
  box-sizing: border-box;
  flex: 1 1 0;
  min-height: 0;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  flex: 1 1 0;
  padding: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 10px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const HeaderTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const EditorWrapper = styled.div`
  flex: 1 1 0;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ViewerWrapper = styled.div`
  flex: 1;
  min-height: 400px;
  border-radius: 12px;
  overflow: auto;
  padding: 0 24px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.errorText};
  background: ${({ theme }) => theme.errorBg};
  border: 1px solid ${({ theme }) => theme.errorBorder};
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  margin-top: 24px;
`;

function CopyIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
  );
}

function ClearIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#ff4d4f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 10v6M15 10v6M10 4h4"/></svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#2d7a46" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v12M6 13l6 6 6-6"/><rect x="4" y="19" width="16" height="2" rx="1"/></svg>
  );
}

function SunIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  );
}

function MoonIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [jsonValue, setJsonValue] = useState<string>(`{
  "string": "example",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value",
    "another": 12
  }
}`)
  const [parsedJson, setParsedJson] = useState<any>(() => {
    try {
      return JSON.parse(`{
  "string": "example",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value",
    "another": 12
  }
}`)
    } catch {
      return null
    }
  })

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return
    try {
      const parsed = JSON.parse(value)
      setJsonError(null)
      setJsonValue(value)
      setParsedJson(parsed)
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message)
        setParsedJson(null)
      }
    }
  }

  const handleEditorCopy = () => {
    navigator.clipboard.writeText(jsonValue)
  }

  const handleEditorClear = () => {
    setJsonValue('')
    setParsedJson(null)
    setJsonError(null)
  }

  const handleViewerCopy = () => {
    if (!jsonError && parsedJson) {
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2))
    }
  }

  const handleViewerClear = () => {
    setJsonValue('')
    setParsedJson(null)
    setJsonError(null)
  }

  const handleViewerDownload = () => {
    if (!jsonError && parsedJson) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedJson, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "formatted.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <PageContainer>
        <HeaderBar>
          <Title>JSON Viewer / Editor</Title>
          <ThemeToggleButton title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </ThemeToggleButton>
        </HeaderBar>
        <AppContainer>
          <Card>
            <Header>
              <HeaderTitle>Editor</HeaderTitle>
              <HeaderActions>
                <IconButton title="Copy" onClick={handleEditorCopy}><CopyIcon color={theme === 'dark' ? '#f7f8fa' : '#23272f'} /></IconButton>
                <IconButton title="Clear" onClick={handleEditorClear}><ClearIcon /></IconButton>
              </HeaderActions>
            </Header>
            <EditorWrapper>
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="json"
                theme={theme === 'light' ? 'light' : 'vs-dark'}
                value={jsonValue}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  wordWrap: 'on',
                  automaticLayout: true,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  roundedSelection: false,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                }}
              />
            </EditorWrapper>
          </Card>
          <Card>
            <Header>
              <HeaderTitle>Viewer</HeaderTitle>
              <HeaderActions>
                <IconButton title="Copy" onClick={handleViewerCopy} disabled={!!jsonError}><CopyIcon color={theme === 'dark' ? '#f7f8fa' : '#23272f'} /></IconButton>
                <IconButton title="Clear" onClick={handleViewerClear}><ClearIcon /></IconButton>
                <IconButton title="Download" onClick={handleViewerDownload} disabled={!!jsonError}><DownloadIcon /></IconButton>
              </HeaderActions>
            </Header>
            <ViewerWrapper>
              {jsonError ? (
                <ErrorMessage>
                  <strong>JSON Error:</strong> {jsonError}
                </ErrorMessage>
              ) : (
                jsonValue.trim() && parsedJson ? (
                  <ReactJson
                    src={parsedJson}
                    name={false}
                    theme={theme === 'light' ? 'rjv-default' : 'monokai'}
                    iconStyle="triangle"
                    displayDataTypes={false}
                    enableClipboard={false}
                    collapsed={false}
                    style={{ background: 'transparent', fontSize: 16 }}
                  />
                ) : (
                  <div style={{ color: darkTheme.placeholder, fontStyle: 'italic', marginTop: 24 }}>No JSON to display</div>
                )
              )}
            </ViewerWrapper>
          </Card>
        </AppContainer>
      </PageContainer>
    </ThemeProvider>
  )
}

export default App
