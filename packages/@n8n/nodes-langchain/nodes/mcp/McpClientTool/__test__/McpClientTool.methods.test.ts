import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { mockDeep } from 'jest-mock-extended';
import type { ILoadOptionsFunctions, INode } from 'n8n-workflow';

import * as sharedUtils from '../../shared/utils';
import { getTools } from '../loadOptions';

describe('McpClientTool Methods', () => {
	const getAuthHeaders = jest.spyOn(sharedUtils, 'getAuthHeaders');
	const connectMcpClient = jest.spyOn(sharedUtils, 'connectMcpClient');
	const getAllTools = jest.spyOn(sharedUtils, 'getAllTools');
	const mockLoadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
	const client = mockDeep<Client>();

	beforeEach(() => {
		jest.resetAllMocks();
		mockLoadOptionsFunctions.getNode.mockReturnValue(mockDeep<INode>({ typeVersion: 2 }));
		connectMcpClient.mockResolvedValue({
			ok: true,
			result: client,
		});
		getAuthHeaders.mockResolvedValue({ headers: {} });
	});

	describe('loadOptions: getTools', () => {
		it('should close the client on success', async () => {
			getAllTools.mockResolvedValue([]);

			await getTools.call(mockLoadOptionsFunctions);

			expect(client.close).toHaveBeenCalledTimes(1);
		});

		it('should close the client on failure', async () => {
			getAllTools.mockRejectedValue(new Error('Fetch failed'));

			await expect(getTools.call(mockLoadOptionsFunctions)).rejects.toThrow('Fetch failed');

			expect(client.close).toHaveBeenCalledTimes(1);
		});
	});
});
