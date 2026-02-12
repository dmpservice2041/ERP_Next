'use client';

import { MasterDataManagement } from '@/components/MasterData/MasterDataManagement';
import { Container } from '@mantine/core';

export default function MasterDataPage() {
    return (
        <Container size="xl" py="xl">
            <MasterDataManagement />
        </Container>
    );
}
