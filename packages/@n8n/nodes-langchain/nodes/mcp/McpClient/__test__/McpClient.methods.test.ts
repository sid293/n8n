import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { mockDeep } from 'jest-mock-extended';
import type { ILoadOptionsFunctions, INode } from 'n8n-workflow';

import * as sharedUtils from '../../shared/utils';
import { getTools } from '../listSearch';
import { getToolParameters } from '../resourceMapping';

describe('McpClient Methods', () => {
	const getAuthHeaders = jest.spyOn(sharedUtils, 'getAuthHeaders');
	const connectMcpClient = jest.spyOn(sharedUtils, 'connectMcpClient');
	const getAllTools = jest.spyOn(sharedUtils, 'getAllTools');
	const mockLoadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
	const client = mockDeep<Client>();

	beforeEach(() => {
		jest.resetAllMocks();
		mockLoadOptionsFunctions.getNode.mockReturnValue(mockDeep<INode>({ typeVersion: 1 }));
		connectMcpClient.mockResolvedValue({
			ok: true,
			result: client,
		});
		getAuthHeaders.mockResolvedValue({ headers: {} });
	});

	describe('listSearch: getTools', () => {
		it('should close the client on success', async () => {
			client.listTools.mockResolvedValue({ tools: [] });

			await getTools.call(mockLoadOptionsFunctions);

			expect(client.close).toHaveBeenCalledTimes(1);
		});

		it('should close the client on failure', async () => {
			client.listTools.mockRejectedValue(new Error('Fetch failed'));

			await expect(getTools.call(mockLoadOptionsFunctions)).rejects.toThrow('Fetch failed');

			expect(client.close).toHaveBeenCalledTimes(1);
		});
	});

	describe('resourceMapping: getToolParameters', () => {
		it('should close the client on success', async () => {
			mockLoadOptionsFunctions.getNodeParameter.mockReturnValue('get_weather');
			getAllTools.mockResolvedValue([
				{ name: 'get_weather', description: 'desc', inputSchema: { type: 'object' } },
			]);

			await getToolParameters.call(mockLoadOptionsFunctions);

			expect(client.close).toHaveBeenCalledTimes(1);
		});

		it('should close the client on failure', async () => {
			mockLoadOptionsFunctions.getNodeParameter.mockReturnValue('get_weather');
			getAllTools.mockRejectedValue(new Error('Fetch failed'));

			await expect(getToolParameters.call(mockLoadOptionsFunctions)).rejects.toThrow(
				'Fetch failed',
			);

			expect(client.close).toHaveBeenCalledTimes(1);
		});
	});
});
