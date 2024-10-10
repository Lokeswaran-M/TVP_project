import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DDDDDD',
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 0,
        backgroundColor: '#FFFFFF',
        position: 'relative',
        color: '#A3238F',
        borderRadius: 10,
        margin: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 0,
    },
    searchInput: {
        flex: 1,
        borderRadius: 25,
        paddingHorizontal: 50, 
        fontSize: 16,
    },
    searchIconContainer: {
        position: 'absolute',
        left: 21, 
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    memberList: {
        flexGrow: 1,
        paddingHorizontal: 10,
        margin: 20,
        paddingBottom: 20,
    },
    memberItem: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 10,
        marginBottom: 8,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    memberDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        // marginLeft: 10,
    },
    profilePicContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#A3238F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    profilePicText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profilePicImage: {
        width: 50, 
        height: 50,
        borderRadius: 25, 
    },
    memberText: {
        flex: 1,
        marginLeft: 15,
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A3238F',
    },
    memberRole: {
        fontSize: 14,
        color: '#555',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    memberCountContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(250, 250, 250, 0.8)',
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#A3238F',
        marginLeft: 250,
        marginTop: 600,
    },
    memberCountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A3238F',
    },
});

export default styles;