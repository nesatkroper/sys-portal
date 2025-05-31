-- CreateTable
CREATE TABLE "Service" (
    "serviceId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serviceName" VARCHAR(50) NOT NULL DEFAULT 'Nun service',
    "serviceType" VARCHAR(50) NOT NULL DEFAULT 'default',
    "ownerName" VARCHAR(200),
    "ownerEmail" VARCHAR(200),
    "ownerPhone" VARCHAR(20),
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "apiVersion" VARCHAR(10) NOT NULL DEFAULT 'v1',
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceId")
);

-- CreateTable
CREATE TABLE "Schema" (
    "unique_id" TEXT NOT NULL,
    "schema_name" TEXT NOT NULL,
    "size_bytes" TEXT NOT NULL,
    "num_tables" INTEGER NOT NULL,
    "num_columns" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "num_connections" INTEGER NOT NULL,
    "connection_status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schema_pkey" PRIMARY KEY ("unique_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Service_apiKey_key" ON "Service"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Service_apiSecret_key" ON "Service"("apiSecret");

-- CreateIndex
CREATE UNIQUE INDEX "Service_apiUrl_key" ON "Service"("apiUrl");
