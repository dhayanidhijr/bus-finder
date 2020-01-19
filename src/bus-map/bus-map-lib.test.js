import BusMapLib from './bus-map-lib';

test('bus lib get expected dto', async () => {
    const getBusLocationsSpy = jest.spyOn(BusMapLib, 'getBusLocations')
        .mockReturnValue([]);
    const data = await BusMapLib.getLocationsDTO();
    expect(getBusLocationsSpy).toBeCalled();
    expect(data).toBeDefined();
});

test('bus lib get expected dto failed', async () => {
    jest.spyOn(BusMapLib, 'getBusLocations')
        .mockImplementation(() => {
            throw ("unexpected exception")
        });
    const data = await BusMapLib.getLocationsDTO();
    expect(data).toStrictEqual([]);
});

test('bus lib get expected dto with route', async () => {
    const getBusLocationsSpy = jest.spyOn(BusMapLib, 'getBusLocations')
        .mockReturnValue([]);
    const someRouteID = "1234132";
    const data = await BusMapLib.getLocationsDTO(someRouteID);
    expect(getBusLocationsSpy).toBeCalled();
    expect(data).toBeDefined();
});

test('bus lib get expected dto failed with route', async () => {
    jest.spyOn(BusMapLib, 'getBusLocations')
        .mockImplementation(() => {
            throw ("unexpected exception")
        });
    const someRouteID = "1234132";
    const data = await BusMapLib.getLocationsDTO(someRouteID);
    expect(data).toStrictEqual([]);
});

test('bus lib get expected dto on fetch call with route and return empty on exception', async () => {
    jest.spyOn(global, 'fetch')
        .mockReturnValue([]);
    jest.spyOn(BusMapLib, 'getBusLocations')
        .mockReturnValue({"Locations": []});
    const someRouteID = "1234132";
    const data = await BusMapLib.getBusLocations(someRouteID);
    expect(data).toStrictEqual({"Locations": []});
});

test('bus lib get expected dto failed on fetch call with route and return empty on exception', async () => {
    jest.spyOn(global, 'fetch')
        .mockImplementation(() => {
            throw ("unexpected exception")
        });
    const someRouteID = "1234132";
    const data = await BusMapLib.getLocationsDTO(someRouteID);
    expect(data).toStrictEqual([]);
});