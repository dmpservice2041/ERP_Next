'use client';

import { DynamicFieldBuilder } from '@/components/DynamicFields/DynamicFieldBuilder';
import { Container } from '@mantine/core';
// @ts-ignore2
export default function DynamicFieldsPage() {
    return (
        <Container size="xl" py="xl">
            <DynamicFieldBuilder />
        </Container>
    );
}
