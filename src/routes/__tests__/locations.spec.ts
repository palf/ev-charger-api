import type { Request, Response } from "express";
import { createLocation, getLocationById } from "../locations";
import { v4 as uuid } from "uuid";

jest.mock("../../logger");

describe("locations routes", () => {
  it("fails with missing id param", async () => {
    const req = { params: {}, body: {} } as Request;

    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);

    await createLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send).toHaveBeenCalled();
  });

  it("fails with missing status param", async () => {
    const req = {
      params: { id: "some id" },
      body: {},
    } as unknown as Request;

    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);

    await createLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send).toHaveBeenCalled();
  });

  it("runs an insert", async () => {
    const req = {
      params: {
        id: "3a3c2fcb-d897-4eda-a735-8dbf1421dc18",
      },
      body: {
        latitude: 30,
        longitude: 40,
      },
    } as unknown as Request;

    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);

    await createLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });
});
