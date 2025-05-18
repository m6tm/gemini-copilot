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
		} else {
			vscode.window.showWarningMessage('Gemini API Key not entered.');
		}
	});
	context.subscriptions.push(setApiKeyCommand);

	// Get the API key from secret storage and initialize the API client
	context.secrets.get('geminiApiKey').then((apiKey: string | undefined) => {
		if (!apiKey) {
			vscode.window.showWarningMessage('Gemini API Key not found. Please set it using the "Set Gemini API Key" command.');
			return;
		}

		const genAI = new GoogleGenerativeAI(apiKey);

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


		// Register a completion item provider
		const provider = vscode.languages.registerCompletionItemProvider(
			'*', // Register for all languages
			{
				async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
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
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
