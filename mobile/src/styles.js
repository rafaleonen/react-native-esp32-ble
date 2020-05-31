import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20
    },

    opacityContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        opacity: 0.5,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    headerText: {
        fontSize: 24,
        color: '#737380'
    },

    return: {
        flexDirection: 'row'
    },

    action: {
        marginTop: 25,
        backgroundColor: '#FFA707',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },

    actionDisabled: {
        marginTop: 25,
        backgroundColor: '#9e9e9e',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },

    actionText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },

    title: {
        marginTop: 15,
        fontSize: 22,
        marginBottom: 16,
        color: '#13131a',
        fontWeight: 'bold'
    },

    actionDevice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },

    deviceText: {
        marginLeft: 10,
        fontSize: 22,
        color: '#737380',
        width: '80%'
    },

    featured: {
        fontWeight: "bold"
    },

    detailContainer: {
        marginVertical: 10,
        padding: 5,
    },

    loadingContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    viewFooter: {
        marginTop: 10
    },

    txtInput: {
        borderWidth: 1,
        borderColor: '#FFA707',
        borderRadius: 8,
        width: '87%'
    },

    viewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center',
    },

    txtBorded: {
        borderColor: '#FFA707',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 8,
        width: '87%'
    }
})