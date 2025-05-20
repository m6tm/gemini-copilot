// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gemini-copilot" is now active!');

	let genAI: GoogleGenerativeAI | undefined;

	// Get the API key from secret storage and initialize the API client
	Promise.resolve(context.secrets.get('geminiApiKey')).then((apiKey: string | undefined) => {
		if (!apiKey) {
			// API Key not found, commands will be registered but API calls will be guarded
			vscode.window.showWarningMessage('Gemini API Key not found. Please set it using the "Set Gemini API Key" command.');
			return; // Do not initialize genAI yet
		}

		genAI = new GoogleGenerativeAI(apiKey);
	}).catch((error: any) => { // Handle rejection here
		console.error('Error retrieving Gemini API Key:', error);
		vscode.window.showErrorMessage('Error retrieving Gemini API Key. Please try setting it again.');
		// Commands are still registered outside this block, but API calls will be guarded.
	});


	// Command to set the API key
	let setApiKeyCommand = vscode.commands.registerCommand('gemini-copilot.setApiKey', async () => {
		const apiKey = await vscode.window.showInputBox({
			prompt: 'Enter your Google Gemini API Key',
			ignoreFocusOut: true,
			password: true
		});

		if (apiKey) {
			await context.secrets.store('geminiApiKey', apiKey);
			vscode.window.showInformationMessage('Gemini API Key stored securely.');
			// Re-initialize genAI if key is set after activation
			genAI = new GoogleGenerativeAI(apiKey);
		} else {
			vscode.window.showWarningMessage('Gemini API Key not entered.');
		}
	});
	context.subscriptions.push(setApiKeyCommand);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gemini-copilot.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Gemini Copilot!');
	});

	context.subscriptions.push(disposable);

	// Command to generate code
	let generateCodeCommand = vscode.commands.registerCommand('gemini-copilot.generateCode', async () => {
		if (!genAI) {
			vscode.window.showWarningMessage('Gemini API Key not set. Please set it using the "Set Gemini API Key" command.');
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active text editor found.');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;

		// Get the selected text or the current line
		const description = selection.isEmpty ?
			document.lineAt(selection.active.line).text :
			document.getText(selection);

		if (description.trim().length === 0) {
			vscode.window.showWarningMessage('Please select some text or place the cursor on a line with a description.');
			return;
		}

		// Show a loading indicator
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		statusBarItem.text = "$(loading~spin) Generating Code...";
		statusBarItem.show();

		try {
			// For text-only input, use the gemini-pro model
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });

			const prompt = `Generate code based on the following description and context:\n\nDescription: ${description}\n\nContext:\n${document.getText()}`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const generatedCode = response.text();

			if (!generatedCode) {
				vscode.window.showInformationMessage('Gemini Copilot did not generate any code.');
				return;
			}

			// Insert the generated code into the editor
			editor.edit(editBuilder => {
				if (selection.isEmpty) {
					editBuilder.insert(editor.selection.active, generatedCode);
				} else {
					editBuilder.replace(selection, generatedCode);
				}
			});

			// Format the document after inserting the code
			await vscode.commands.executeCommand('editor.action.formatDocument');

			vscode.window.showInformationMessage('Code generated and inserted.');

		} catch (error: any) { // Explicitly type error as any for now
			console.error('Error calling Gemini API for code generation:', error);
			vscode.window.showErrorMessage(`Gemini Copilot Error during code generation: ${error.message}`);
		} finally {
			// Hide the loading indicator
			statusBarItem.dispose();
		}
	});
	context.subscriptions.push(generateCodeCommand);

	// Command to explain code
	let explainCodeCommand = vscode.commands.registerCommand('gemini-copilot.explainCode', async () => {
		if (!genAI) {
			vscode.window.showWarningMessage('Gemini API Key not set. Please set it using the "Set Gemini API Key" command.');
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active text editor found.');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;

		const codeToExplain = document.getText(selection);

		if (codeToExplain.trim().length === 0) {
			vscode.window.showWarningMessage('Please select the code you want to explain.');
			return;
		}

		// Create and show a new webview panel
		const panel = vscode.window.createWebviewPanel(
			'geminiCopilotExplanation', // Identifies the type of the webview. Used internally
			'Gemini Copilot Explanation', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new panel in.
			{
				enableScripts: true // Enable scripts in the webview
			}
		);

		// Set initial HTML content for the webview
		panel.webview.html = getWebviewContent(codeToExplain, 'Loading explanation from Gemini Copilot...');

		// Show a loading indicator (optional, webview can show loading state)
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		statusBarItem.text = "$(loading~spin) Explaining Code...";
		statusBarItem.show();


		try {
			// For text-only input, use the gemini-pro model
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });

			const prompt = `Explain the following code:\n\n${codeToExplain}\n\nContext:\n${document.getText()}`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const explanationText = response.text();

			if (!explanationText) {
				panel.webview.html = getWebviewContent(codeToExplain, 'Gemini Copilot did not provide an explanation.');
				vscode.window.showInformationMessage('Gemini Copilot did not provide an explanation.');
				return;
			}

			// Update the webview content with the explanation
			panel.webview.html = getWebviewContent(codeToExplain, explanationText);


		} catch (error: any) { // Explicitly type error as any for now
			console.error('Error calling Gemini API for code explanation:', error);
			panel.webview.html = getWebviewContent(codeToExplain, `Error: ${error.message}`);
			vscode.window.showErrorMessage(`Gemini Copilot Error during code explanation: ${error.message}`);
		} finally {
			// Hide the loading indicator
			statusBarItem.dispose();
		}
	});
	context.subscriptions.push(explainCodeCommand);

	// Command to document code
	let documentCodeCommand = vscode.commands.registerCommand('gemini-copilot.documentCode', async () => {
		if (!genAI) {
			vscode.window.showWarningMessage('Gemini API Key not set. Please set it using the "Set Gemini API Key" command.');
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active text editor found.');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;

		const codeToDocument = document.getText(selection);

		if (codeToDocument.trim().length === 0) {
			vscode.window.showWarningMessage('Please select the code you want to document or place the cursor on a line with code.');
			return;
		}

		// Show a loading indicator
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		statusBarItem.text = "$(loading~spin) Documenting Code...";
		statusBarItem.show();

		try {
			// For text-only input, use the gemini-pro model
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });

			const prompt = `Generate documentation for the following code. Use the appropriate comment style for the language of the file.\n\nCode:\n${codeToDocument}\n\nContext:\n${document.getText()}`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const documentationText = response.text();

			if (!documentationText) {
				vscode.window.showInformationMessage('Gemini Copilot did not generate any documentation.');
				return;
			}

			// Insert the generated documentation before the selection
			editor.edit(editBuilder => {
				editBuilder.insert(selection.start, documentationText + '\n');
			});

			vscode.window.showInformationMessage('Documentation generated and inserted.');

		} catch (error: any) { // Explicitly type error as any for now
			console.error('Error calling Gemini API for code documentation:', error);
			vscode.window.showErrorMessage(`Gemini Copilot Error during code documentation: ${error.message}`);
		} finally {
			// Hide the loading indicator
			statusBarItem.dispose();
		}
	});
	context.subscriptions.push(documentCodeCommand);

	// Helper function to get webview content
	function getWebviewContent(code: string, explanation: string): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Gemini Copilot Explanation</title>
		  <style>
		      code {
		          white-space: pre-wrap;
		      }
		  </style>
</head>
<body>
		  <h1>Code to Explain:</h1>
		  <pre><code>${escapeHtml(code)}</code></pre>
		  <h1>Explanation:</h1>
		  <p>${escapeHtml(explanation)}</p>
</body>
</html>`;
	}

	// Basic HTML escaping for displaying code
	function escapeHtml(unsafe: string): string {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}


	// Register a completion item provider
	const provider = vscode.languages.registerCompletionItemProvider(
		'*', // Register for all languages
		{
			async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
				if (!genAI) {
					// API key not set, do not provide suggestions
					return undefined;
				}

				// Get the text from the current line up to the cursor position
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				console.log(`Completion requested with line prefix: ${linePrefix}`);

				if (linePrefix.length === 0) {
					return undefined; // No suggestions if the line is empty
				}

				// Check if the completion was triggered by a specific character
				// If so, only provide suggestions if the character is one of our commit characters
				if (context.triggerKind === vscode.CompletionTriggerKind.TriggerCharacter) {
					const commitCharacters = ['.', ' ', '(', ';'];
					if (!commitCharacters.includes(context.triggerCharacter || '')) {
						return undefined;
					}
				}

				// Show a loading indicator
				const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
				statusBarItem.text = "$(loading~spin) Gemini Copilot...";
				statusBarItem.show();


				try {
					// For text-only input, use the gemini-pro model
					const model = genAI.getGenerativeModel({ model: "gemini-pro" });

					const result = await model.generateContent(linePrefix);
					const response = await result.response;
					const text = response.text();

					if (!text) {
						return undefined;
					}

					// Treat the entire response as a single completion item
					const completionItem = new vscode.CompletionItem(text.trim(), vscode.CompletionItemKind.Text);
					// Optional: Add more details like documentation
					// completionItem.documentation = new vscode.MarkdownString("Gemini Copilot Suggestion");

					// Trigger completion on certain characters
					completionItem.commitCharacters = ['.', ' ', '(', ';'];

					return [completionItem];

				} catch (error: any) { // Explicitly type error as any for now
					console.error('Error calling Gemini API:', error);
					vscode.window.showErrorMessage(`Gemini Copilot Error: ${error.message}`);
					return undefined;
				} finally {
					// Hide the loading indicator
					statusBarItem.dispose();
				}
			}
		},
		'.', ' ', '(', ';' // Characters that trigger completion
	);

	context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
