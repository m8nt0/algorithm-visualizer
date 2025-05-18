import type { SupportedLanguage } from '../shared/types';

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
}

export interface InterpreterOptions {
  timeoutMs?: number;
  memoryLimitMb?: number;
}

export interface Interpreter {
  execute(code: string, language: SupportedLanguage, options?: InterpreterOptions): Promise<ExecutionResult>;
  getLanguageInfo(language: SupportedLanguage): LanguageInfo;
  getSupportedLanguages(): SupportedLanguage[];
}

export interface LanguageInfo {
  name: string;
  version: string;
  fileExtension: string;
  syntaxHighlightKey: string;
}

// Base implementation using browser-based execution
export class BrowserInterpreter implements Interpreter {
  private readonly languageMap: Record<SupportedLanguage, LanguageInfo> = {
    typescript: {
      name: 'TypeScript',
      version: '4.9.5',
      fileExtension: '.ts',
      syntaxHighlightKey: 'typescript'
    },
    javascript: {
      name: 'JavaScript',
      version: 'ES2022',
      fileExtension: '.js',
      syntaxHighlightKey: 'javascript'
    },
    python: {
      name: 'Python',
      version: '3.10',
      fileExtension: '.py',
      syntaxHighlightKey: 'python'
    },
    cpp: {
      name: 'C++',
      version: 'C++17',
      fileExtension: '.cpp',
      syntaxHighlightKey: 'cpp'
    },
    java: {
      name: 'Java',
      version: '17',
      fileExtension: '.java',
      syntaxHighlightKey: 'java'
    }
  };

  async execute(code: string, language: SupportedLanguage, options: InterpreterOptions = {}): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      switch (language) {
        case 'javascript':
          return await this.executeJavaScript(code, options);
        case 'typescript':
          return await this.executeTypeScript(code, options);
        default:
          return {
            output: '',
            error: `Language '${language}' is not supported in the browser interpreter. Future versions will support this language via WebAssembly.`
          };
      }
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime
      };
    }
  }

  getLanguageInfo(language: SupportedLanguage): LanguageInfo {
    return this.languageMap[language];
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(this.languageMap) as SupportedLanguage[];
  }

  private async executeJavaScript(code: string, options: InterpreterOptions): Promise<ExecutionResult> {
    const startTime = performance.now();
    let output = '';
    const originalConsoleLog = console.log;
    
    try {
      // Override console.log to capture output
      console.log = (...args) => {
        output += args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ') + '\n';
        originalConsoleLog(...args);
      };
      
      // Execute the code in a safe way
      const asyncFunction = new Function('return async function() { ' + code + ' }')();
      await asyncFunction();
      
      return {
        output,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        output,
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime
      };
    } finally {
      console.log = originalConsoleLog;
    }
  }

  private async executeTypeScript(code: string, options: InterpreterOptions): Promise<ExecutionResult> {
    // In a real implementation, we would transpile TS to JS first
    // For now, we'll just execute it as JS and assume it's valid
    return this.executeJavaScript(code, options);
  }
}

// Factory to create the appropriate interpreter based on environment
export function createInterpreter(): Interpreter {
  // For now, we only have the browser interpreter
  // In the future, we could add server-side interpreters or WASM-based ones
  return new BrowserInterpreter();
} 